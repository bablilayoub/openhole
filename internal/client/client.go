package client

import (
	"fmt"
	"net"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/bablilayoub/openhole/internal/protocol"
	"github.com/bablilayoub/openhole/internal/shared"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

const (
	maxConcurrentLocal   = 25
	shutdownDrainTimeout = 5 * time.Second
)

type Client struct {
	cfg           Config
	reconnects    int
	lastPublicURL string
	writeMu       sync.Mutex
	reqSem        chan struct{}
	inflight      sync.WaitGroup
}

func New(cfg Config) *Client {
	return &Client{
		cfg:    cfg,
		reqSem: make(chan struct{}, maxConcurrentLocal),
	}
}

func (c *Client) Run() error {
	clearStaleSession()
	defer clearSession()

	shutdown := shared.ListenForShutdown(func() {
		fmt.Fprintln(os.Stderr, shared.Paint(shared.AnsiDim, "\nShutting down..."))
	})
	done := shutdown.Done()

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
		if !isReconnectable(err) {
			return err
		}

		fmt.Println(shared.Paint(shared.AnsiYellow, "Connection lost. Reconnecting..."))
		select {
		case <-done:
			return nil
		case <-time.After(backoff):
		}
		backoff *= 2
		if backoff > 30*time.Second {
			backoff = 30 * time.Second
		}
	}
}

func (c *Client) runSession(done <-chan struct{}) error {
	if err := validateServerURL(c.cfg.ServerURL); err != nil {
		return err
	}

	conn, _, err := websocket.DefaultDialer.Dial(c.cfg.ServerURL, nil)
	if err != nil {
		return err
	}
	defer conn.Close()
	conn.SetReadLimit(protocol.MaxMessageSize)

	reclaimToken := ""
	if c.cfg.Subdomain != "" {
		reclaimToken = loadReclaimToken(c.cfg.Subdomain)
	}

	reg := protocol.RegisterMessage{
		Type:               protocol.TypeRegister,
		ClientID:           uuid.NewString(),
		RequestedSubdomain: c.cfg.Subdomain,
		ReclaimToken:       reclaimToken,
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
		return c.registerError(em.Message)
	}
	if env.Type != protocol.TypeRegistered {
		return fmt.Errorf("unexpected response: %s", env.Type)
	}
	regd, err := protocol.ParseRegistered(raw)
	if err != nil {
		return err
	}

	if regd.ReclaimToken != "" && c.cfg.Subdomain != "" {
		want := strings.ToLower(strings.TrimSpace(c.cfg.Subdomain))
		if regd.Subdomain == want {
			_ = saveReclaimToken(regd.Subdomain, regd.ReclaimToken)
		}
	}

	if c.reconnects == 0 {
		warn := fmt.Sprintf(
			"⚠  This exposes http://%s to the internet. Anyone with the URL can access it.",
			net.JoinHostPort(c.cfg.Host, strconv.Itoa(c.cfg.Port)),
		)
		fmt.Fprintf(os.Stderr, "\n%s\n\n", shared.PaintErr(shared.AnsiYellow, warn))
		fmt.Printf("%s\n\n%s\n",
			shared.Paint(shared.AnsiBold, "OpenHole "+shared.Version),
			shared.Paint(shared.AnsiGreen, "✓ Tunnel ready"),
		)
	} else {
		fmt.Println(shared.Paint(shared.AnsiGreen, "✓ Reconnected"))
		if c.lastPublicURL != "" && c.lastPublicURL != regd.PublicURL {
			fmt.Fprintf(os.Stderr, "\n%s\n\n",
				shared.PaintErr(shared.AnsiYellow,
					fmt.Sprintf("⚠  Public URL changed:\n   was %s\n   now %s", c.lastPublicURL, regd.PublicURL),
				),
			)
		}
	}
	c.lastPublicURL = regd.PublicURL
	startedAt := time.Now()
	if s, ok := loadSession(); ok && s.PID == os.Getpid() {
		startedAt = s.StartedAt
	}
	_ = saveSession(Session{
		PID:       os.Getpid(),
		PublicURL: regd.PublicURL,
		Subdomain: regd.Subdomain,
		Host:      c.cfg.Host,
		Port:      c.cfg.Port,
		ServerURL: c.cfg.ServerURL,
		StartedAt: startedAt,
	})
	fmt.Printf("%s %s\n", shared.Paint(shared.AnsiDim, "→"), shared.Paint(shared.AnsiCyan, regd.PublicURL))
	fmt.Printf("%s %s\n\n",
		shared.Paint(shared.AnsiDim, "→"),
		shared.Paint(shared.AnsiDim, fmt.Sprintf("forwarding to http://%s:%d", c.cfg.Host, c.cfg.Port)),
	)
	if c.reconnects == 0 {
		fmt.Println(shared.Paint(shared.AnsiDim, "Requests:"))
	}
	c.reconnects++

	errCh := make(chan error, 1)
	go func() {
		errCh <- c.readLoop(conn)
	}()

	select {
	case <-done:
		_ = conn.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
		_ = conn.Close()
		drainInflight(c, shutdownDrainTimeout)
		return nil
	case err := <-errCh:
		return err
	}
}

func drainInflight(c *Client, timeout time.Duration) {
	wait := make(chan struct{})
	go func() {
		c.inflight.Wait()
		close(wait)
	}()
	select {
	case <-wait:
	case <-time.After(timeout):
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
	c.inflight.Add(1)
	defer c.inflight.Done()

	select {
	case c.reqSem <- struct{}{}:
	default:
		_ = c.writeMessage(conn, protocol.ErrorMessage{
			Type:      protocol.TypeError,
			RequestID: req.RequestID,
			Message:   "too many concurrent requests",
		})
		logRequest(req.Method, req.Path, 503, 0)
		return
	}
	defer func() { <-c.reqSem }()

	resp, dur, err := ForwardToLocal(req, c.cfg.Host, c.cfg.Port)
	if err != nil {
		msg := "local backend unavailable"
		if c.cfg.Verbose {
			msg = err.Error()
		}
		_ = c.writeMessage(conn, protocol.ErrorMessage{
			Type:      protocol.TypeError,
			RequestID: req.RequestID,
			Message:   msg,
		})
		logRequest(req.Method, req.Path, 502, dur)
		return
	}
	_ = c.writeMessage(conn, resp)
	logRequest(req.Method, req.Path, resp.StatusCode, dur)
}
