package server

import (
	"encoding/base64"
	"net/http"
	"time"

	"github.com/bablilayoub/openhole/internal/protocol"
	"github.com/bablilayoub/openhole/internal/shared"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var publicWSUpgrader = websocket.Upgrader{
	CheckOrigin:     func(r *http.Request) bool { return true },
	ReadBufferSize:  4096,
	WriteBufferSize: 4096,
}

func (s *Server) handleWebSocketProxy(w http.ResponseWriter, r *http.Request, tunnel *Tunnel, subdomain string) {
	streamID := uuid.NewString()

	body, err := readBodyLimited(r.Body, s.cfg.MaxBodyBytes)
	if err != nil {
		if err == shared.ErrBodyTooLarge {
			http.Error(w, "payload too large", http.StatusRequestEntityTooLarge)
			return
		}
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	path := requestPath(r)
	if err := shared.ValidateRequestPath(path); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	ip := ClientIP(r, s.cfg.TrustProxyHeaders)
	headers := shared.WebSocketHandshakeHeaders(r.Header)
	headers["X-Forwarded-For"] = []string{ip}
	headers["X-Forwarded-Host"] = []string{r.Host}
	headers["X-Forwarded-Proto"] = []string{"https"}
	if s.cfg.PublicURLScheme == "http" {
		headers["X-Forwarded-Proto"] = []string{"http"}
	}
	headers["X-OpenHole-Tunnel"] = []string{subdomain}

	openMsg := protocol.WSOpenMessage{
		Type:       protocol.TypeWSOpen,
		StreamID:   streamID,
		Method:     r.Method,
		Path:       path,
		Query:      r.URL.RawQuery,
		Headers:    headers,
		BodyBase64: base64.StdEncoding.EncodeToString(body),
	}
	if err := protocol.ValidateWSOpen(&openMsg); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	stream, err := tunnel.registerWSStream(streamID)
	if err != nil {
		http.Error(w, "too many websocket connections", http.StatusServiceUnavailable)
		return
	}
	defer tunnel.unregisterWSStream(streamID)

	if err := tunnel.WriteMessage(openMsg); err != nil {
		http.Error(w, http.StatusText(http.StatusBadGateway), http.StatusBadGateway)
		return
	}

	timeout := time.Duration(s.cfg.RequestTimeoutSeconds) * time.Second
	timer := time.NewTimer(timeout)
	defer timer.Stop()

	var result wsOpenResult
	select {
	case result = <-stream.openResult:
	case <-timer.C:
		http.Error(w, http.StatusText(http.StatusGatewayTimeout), http.StatusGatewayTimeout)
		return
	}

	if !result.OK {
		status := result.StatusCode
		if status < 400 || status > 599 {
			status = http.StatusBadGateway
		}
		http.Error(w, result.Message, status)
		return
	}

	publicConn, err := completeWebSocketUpgrade(w, r, result.Headers)
	if err != nil {
		s.log.Warn("websocket upgrade failed", "subdomain", subdomain, "err", err)
		http.Error(w, http.StatusText(http.StatusBadGateway), http.StatusBadGateway)
		return
	}
	defer publicConn.Close()

	s.log.Info("websocket stream open",
		"host", subdomain+"."+s.cfg.PublicTunnelDomain,
		"path", path,
		"stream", streamID,
	)

	errCh := make(chan error, 2)

	go func() {
		defer publicConn.Close()
		for {
			mt, data, err := publicConn.ReadMessage()
			if err != nil {
				errCh <- err
				return
			}
			tunnel.writeMu.Lock()
			werr := protocol.WriteWSFrame(tunnel.Conn, streamID, mt, data)
			tunnel.writeMu.Unlock()
			if werr != nil {
				errCh <- werr
				return
			}
		}
	}()

	for {
		select {
		case frame := <-stream.fromClient:
			if err := publicConn.WriteMessage(frame.Opcode, frame.Data); err != nil {
				return
			}
		case <-stream.done:
			return
		case <-errCh:
			return
		}
	}
}

func completeWebSocketUpgrade(w http.ResponseWriter, r *http.Request, backendHeaders map[string][]string) (*websocket.Conn, error) {
	return publicWSUpgrader.Upgrade(w, r, negotiatedWSHeaders(backendHeaders))
}

func negotiatedWSHeaders(backend map[string][]string) http.Header {
	out := http.Header{}
	for _, name := range []string{"Sec-WebSocket-Protocol", "Sec-WebSocket-Extensions"} {
		canonical := http.CanonicalHeaderKey(name)
		for _, v := range backend[canonical] {
			out.Add(canonical, v)
		}
	}
	return out
}

func (s *Server) dispatchWSFrame(tunnel *Tunnel, frame *protocol.WSFrame) {
	stream := tunnel.getWSStream(frame.StreamID)
	if stream == nil {
		return
	}
	relay := wsRelayFrame{Opcode: frame.Opcode, Data: frame.Payload}
	select {
	case stream.fromClient <- relay:
	default:
		stream.close()
	}
}

func (s *Server) dispatchWSOpenResult(tunnel *Tunnel, okMsg *protocol.WSOpenOKMessage) {
	stream := tunnel.getWSStream(okMsg.StreamID)
	if stream == nil {
		return
	}
	select {
	case stream.openResult <- wsOpenResult{OK: true, Headers: okMsg.Headers}:
	default:
	}
}

func (s *Server) dispatchWSOpenFail(tunnel *Tunnel, failMsg *protocol.WSOpenFailMessage) {
	stream := tunnel.getWSStream(failMsg.StreamID)
	if stream == nil {
		return
	}
	select {
	case stream.openResult <- wsOpenResult{
		OK:         false,
		StatusCode: failMsg.StatusCode,
		Message:    failMsg.Message,
	}:
	default:
	}
}
