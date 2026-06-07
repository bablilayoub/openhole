package client

import (
	"fmt"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"github.com/bablilayoub/openhole/internal/protocol"
	"github.com/bablilayoub/openhole/internal/shared"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type Client struct {
	cfg        Config
	reconnects int
	writeMu    sync.Mutex
}

func New(cfg Config) *Client {
	return &Client{cfg: cfg}
}

func (c *Client) Run() error {
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)

	done := make(chan struct{})
	go func() {
		<-sig
		close(done)
	}()

	backoff := 2 * time.Second
	for {
		select {
		case <-done:
			return nil
		default:
		}

		err := c.runSession(done)
		if err == nil {
			return nil
		}

		select {
		case <-done:
			return nil
		default:
			fmt.Println("Connection lost. Reconnecting...")
			time.Sleep(backoff)
			backoff *= 2
			if backoff > 30*time.Second {
				backoff = 30 * time.Second
			}
		}
	}
}

func (c *Client) runSession(done <-chan struct{}) error {
	conn, _, err := websocket.DefaultDialer.Dial(c.cfg.ServerURL, nil)
	if err != nil {
		return err
	}
	defer conn.Close()
	conn.SetReadLimit(protocol.MaxMessageSize)

	reg := protocol.RegisterMessage{
		Type:               protocol.TypeRegister,
		ClientID:           uuid.NewString(),
		RequestedSubdomain: c.cfg.Subdomain,
		LocalPort:          c.cfg.Port,
		LocalHost:          c.cfg.Host,
		Version:            shared.Version,
	}
	if err := c.writeMessage(conn, reg); err != nil {
		return err
	}

	env, raw, err := protocol.ReadMessage(conn)
	if err != nil {
		return err
	}
	if env.Type == protocol.TypeError {
		em, _ := protocol.ParseError(raw)
		return fmt.Errorf("%s", em.Message)
	}
	if env.Type != protocol.TypeRegistered {
		return fmt.Errorf("unexpected response: %s", env.Type)
	}
	regd, err := protocol.ParseRegistered(raw)
	if err != nil {
		return err
	}

	if c.reconnects == 0 {
		fmt.Printf("OpenHole %s\n\n✓ Tunnel ready\n", shared.Version)
	} else {
		fmt.Println("✓ Reconnected")
	}
	fmt.Printf("→ %s\n", regd.PublicURL)
	fmt.Printf("→ forwarding to http://%s:%d\n\n", c.cfg.Host, c.cfg.Port)
	if c.reconnects == 0 {
		fmt.Println("Requests:")
	}
	c.reconnects++

	errCh := make(chan error, 1)
	go func() {
		errCh <- c.readLoop(conn)
	}()

	select {
	case <-done:
		_ = conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
		return nil
	case err := <-errCh:
		return err
	}
}

func (c *Client) readLoop(conn *websocket.Conn) error {
	for {
		env, raw, err := protocol.ReadMessage(conn)
		if err != nil {
			return err
		}
		switch env.Type {
		case protocol.TypeRequest:
			req, err := protocol.ParseRequest(raw)
			if err != nil {
				_ = c.writeMessage(conn, protocol.ErrorMessage{
					Type:    protocol.TypeError,
					Message: "invalid request message",
				})
				continue
			}
			go c.handleRequest(conn, req)
		case protocol.TypePing:
			_ = c.writeMessage(conn, protocol.PongMessage{Type: protocol.TypePong})
		case protocol.TypePong:
		default:
		}
	}
}

func (c *Client) writeMessage(conn *websocket.Conn, v any) error {
	c.writeMu.Lock()
	defer c.writeMu.Unlock()
	return protocol.WriteMessage(conn, v)
}

func (c *Client) handleRequest(conn *websocket.Conn, req protocol.RequestMessage) {
	resp, dur, err := ForwardToLocal(req, c.cfg.Host, c.cfg.Port)
	if err != nil {
		_ = c.writeMessage(conn, protocol.ErrorMessage{
			Type:      protocol.TypeError,
			RequestID: req.RequestID,
			Message:   err.Error(),
		})
		logRequest(req.Method, req.Path, 502, dur)
		return
	}
	_ = c.writeMessage(conn, resp)
	logRequest(req.Method, req.Path, resp.StatusCode, dur)
}
