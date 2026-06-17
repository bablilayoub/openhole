package client

import (
	"net"
	"net/http"
	"net/url"
	"strconv"
	"sync"
	"time"

	"github.com/bablilayoub/openhole/internal/protocol"
	"github.com/bablilayoub/openhole/internal/shared"
	"github.com/gorilla/websocket"
)

type wsRelayFrame struct {
	Opcode int
	Data   []byte
}

type clientWSStream struct {
	fromTunnel chan wsRelayFrame
	done       chan struct{}
	closeOnce  sync.Once
}

func (s *clientWSStream) close() {
	s.closeOnce.Do(func() {
		close(s.done)
	})
}

func (c *Client) registerWSStream(id string) *clientWSStream {
	c.wsMu.Lock()
	defer c.wsMu.Unlock()
	if c.wsStreams == nil {
		c.wsStreams = make(map[string]*clientWSStream)
	}
	stream := &clientWSStream{
		fromTunnel: make(chan wsRelayFrame, 32),
		done:       make(chan struct{}),
	}
	c.wsStreams[id] = stream
	return stream
}

func (c *Client) unregisterWSStream(id string) {
	c.wsMu.Lock()
	defer c.wsMu.Unlock()
	if stream, ok := c.wsStreams[id]; ok {
		stream.close()
		delete(c.wsStreams, id)
	}
}

func (c *Client) dispatchWSFrame(frame *protocol.WSFrame) {
	c.wsMu.RLock()
	stream := c.wsStreams[frame.StreamID]
	c.wsMu.RUnlock()
	if stream == nil {
		return
	}
	relay := wsRelayFrame{Opcode: frame.Opcode, Data: frame.Payload}
	select {
	case stream.fromTunnel <- relay:
	default:
		stream.close()
	}
}

func (c *Client) handleWSOpen(conn *websocket.Conn, open protocol.WSOpenMessage) {
	go c.runWSStream(conn, open)
}

func (c *Client) runWSStream(control *websocket.Conn, open protocol.WSOpenMessage) {
	stream := c.registerWSStream(open.StreamID)
	defer c.unregisterWSStream(open.StreamID)

	if err := shared.ValidateHTTPMethod(open.Method); err != nil {
		c.sendWSOpenFail(control, open.StreamID, http.StatusBadRequest, "invalid method")
		return
	}
	if err := shared.ValidateRequestPath(open.Path); err != nil {
		c.sendWSOpenFail(control, open.StreamID, http.StatusBadRequest, "invalid path")
		return
	}
	if err := shared.ValidateHost(c.cfg.Host); err != nil {
		c.sendWSOpenFail(control, open.StreamID, http.StatusBadGateway, "invalid local host")
		return
	}

	localURL, err := localWebSocketURL(c.cfg.Host, c.cfg.Port, open.Path, open.Query)
	if err != nil {
		c.sendWSOpenFail(control, open.StreamID, http.StatusBadGateway, "invalid local url")
		return
	}

	header := http.Header{}
	for k, vals := range shared.SanitizeIncomingHeaderMap(open.Headers) {
		for _, v := range vals {
			header.Add(k, v)
		}
	}
	hostPort := net.JoinHostPort(c.cfg.Host, strconv.Itoa(c.cfg.Port))
	header.Set("Host", hostPort)

	dialer := websocket.Dialer{
		HandshakeTimeout: 30 * time.Second,
	}
	localConn, resp, err := dialer.Dial(localURL, header)
	if err != nil {
		status := http.StatusBadGateway
		msg := "local websocket upgrade failed"
		if resp != nil {
			status = resp.StatusCode
			if status == 0 {
				status = http.StatusBadGateway
			}
			if c.cfg.Verbose {
				msg = err.Error()
			}
		} else if c.cfg.Verbose {
			msg = err.Error()
		}
		c.sendWSOpenFail(control, open.StreamID, status, msg)
		return
	}
	defer localConn.Close()

	okMsg := protocol.WSOpenOKMessage{
		Type:     protocol.TypeWSOpenOK,
		StreamID: open.StreamID,
		Headers:  shared.WebSocketResponseHeaders(resp.Header),
	}
	if err := c.writeMessage(control, okMsg); err != nil {
		return
	}

	logRequest(c.cfg.Port, open.Method, open.Path, http.StatusSwitchingProtocols, 0)

	errCh := make(chan error, 2)
	go func() {
		defer localConn.Close()
		for {
			mt, data, err := localConn.ReadMessage()
			if err != nil {
				errCh <- err
				return
			}
			c.writeMu.Lock()
			werr := protocol.WriteWSFrame(control, open.StreamID, mt, data)
			c.writeMu.Unlock()
			if werr != nil {
				errCh <- werr
				return
			}
		}
	}()

	for {
		select {
		case frame := <-stream.fromTunnel:
			if err := localConn.WriteMessage(frame.Opcode, frame.Data); err != nil {
				return
			}
		case <-stream.done:
			return
		case <-errCh:
			return
		}
	}
}

func (c *Client) sendWSOpenFail(conn *websocket.Conn, streamID string, status int, message string) {
	_ = c.writeMessage(conn, protocol.WSOpenFailMessage{
		Type:       protocol.TypeWSOpenFail,
		StreamID:   streamID,
		StatusCode: status,
		Message:    message,
	})
}

func localWebSocketURL(host string, port int, path, query string) (string, error) {
	if path == "" {
		path = "/"
	}
	u := &url.URL{
		Scheme:   "ws",
		Host:     net.JoinHostPort(host, strconv.Itoa(port)),
		Path:     path,
		RawQuery: query,
	}
	return u.String(), nil
}
