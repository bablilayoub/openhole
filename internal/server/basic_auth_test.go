package server

import (
	"encoding/base64"
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/bablilayoub/openhole/internal/protocol"
	"github.com/bablilayoub/openhole/internal/shared"
	"github.com/gorilla/websocket"
)

// fakeTunnelClient answers every forwarded request with 200 and records the
// headers it saw, standing in for the CLI on the far end of the tunnel.
func fakeTunnelClient(t *testing.T) (conn *websocket.Conn, seen <-chan map[string][]string) {
	t.Helper()
	headers := make(chan map[string][]string, 8)
	up := websocket.Upgrader{}
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		c, err := up.Upgrade(w, r, nil)
		if err != nil {
			return
		}
		defer c.Close()
		for {
			_, data, err := c.ReadMessage()
			if err != nil {
				return
			}
			var req protocol.RequestMessage
			if json.Unmarshal(data, &req) != nil || req.Type != protocol.TypeRequest {
				continue
			}
			headers <- req.Headers
			_ = protocol.WriteMessage(c, protocol.ResponseMessage{
				Type:       protocol.TypeResponse,
				RequestID:  req.RequestID,
				StatusCode: http.StatusOK,
				Headers:    map[string][]string{"Content-Type": {"text/plain"}},
				BodyBase64: base64.StdEncoding.EncodeToString([]byte("ok")),
			})
		}
	}))
	t.Cleanup(srv.Close)

	conn, _, err := websocket.DefaultDialer.Dial("ws"+strings.TrimPrefix(srv.URL, "http"), nil)
	if err != nil {
		t.Fatal(err)
	}
	t.Cleanup(func() { conn.Close() })
	return conn, headers
}

func newGateServer(t *testing.T, auth *shared.BasicAuth) (*Server, <-chan map[string][]string) {
	t.Helper()
	cfg := Config{
		PublicTunnelDomain:                "ophl.test",
		MaxBodyBytes:                      1 << 20,
		RequestTimeoutSeconds:             5,
		MaxPublicRequestsPerIPPerMinute:   1000,
		MaxAuthFailuresPerTunnelPerMinute: 3,
	}
	s := New(cfg, slog.New(slog.NewTextHandler(io.Discard, nil)))

	conn, seen := fakeTunnelClient(t)
	tunnel := &Tunnel{
		ID:        "t1",
		Subdomain: "blue-fox",
		Conn:      conn,
		ClientIP:  "203.0.113.5",
		BasicAuth: auth,
		Pending:   make(map[string]chan tunnelResponse),
		sem:       make(chan struct{}, 4),
	}
	if err := s.registry.Register(tunnel); err != nil {
		t.Fatal(err)
	}
	go s.tunnelReadLoop(tunnel)
	return s, seen
}

func TestPublicProxyBasicAuthGate(t *testing.T) {
	s, seen := newGateServer(t, shared.NewBasicAuth("demo", "secret"))

	// No credentials: challenge, nothing forwarded.
	rec := httptest.NewRecorder()
	s.handlePublicProxy(rec, httptest.NewRequest(http.MethodGet, "/", nil), "blue-fox")
	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("missing creds: status %d", rec.Code)
	}
	if got := rec.Header().Get("WWW-Authenticate"); !strings.HasPrefix(got, "Basic ") {
		t.Fatalf("missing challenge header: %q", got)
	}

	// Correct credentials: forwarded, and Authorization never reaches the app.
	req := httptest.NewRequest(http.MethodGet, "/private", nil)
	req.SetBasicAuth("demo", "secret")
	req.Header.Set("X-Custom", "keep")
	rec = httptest.NewRecorder()
	s.handlePublicProxy(rec, req, "blue-fox")
	if rec.Code != http.StatusOK {
		t.Fatalf("valid creds: status %d body %q", rec.Code, rec.Body.String())
	}
	forwarded := <-seen
	for k := range forwarded {
		if strings.EqualFold(k, "Authorization") {
			t.Fatal("Authorization leaked to the local app")
		}
	}
	if forwarded["X-Custom"] == nil {
		t.Fatal("unrelated headers must still be forwarded")
	}
}

func TestPublicProxyBasicAuthLockout(t *testing.T) {
	s, _ := newGateServer(t, shared.NewBasicAuth("demo", "secret"))

	for i := 0; i < 3; i++ {
		req := httptest.NewRequest(http.MethodGet, "/", nil)
		req.SetBasicAuth("demo", "wrong")
		rec := httptest.NewRecorder()
		s.handlePublicProxy(rec, req, "blue-fox")
		if rec.Code != http.StatusUnauthorized {
			t.Fatalf("attempt %d: status %d", i+1, rec.Code)
		}
	}

	// Budget spent: even the right password waits for the window.
	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.SetBasicAuth("demo", "secret")
	rec := httptest.NewRecorder()
	s.handlePublicProxy(rec, req, "blue-fox")
	if rec.Code != http.StatusTooManyRequests {
		t.Fatalf("after lockout: status %d", rec.Code)
	}
}

func TestPublicProxyOpenTunnelKeepsAuthorization(t *testing.T) {
	s, seen := newGateServer(t, nil)

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	req.Header.Set("Authorization", "Bearer app-token")
	rec := httptest.NewRecorder()
	s.handlePublicProxy(rec, req, "blue-fox")
	if rec.Code != http.StatusOK {
		t.Fatalf("open tunnel: status %d", rec.Code)
	}
	forwarded := <-seen
	if got := forwarded["Authorization"]; len(got) != 1 || got[0] != "Bearer app-token" {
		t.Fatalf("open tunnels must pass the app's own Authorization through, got %v", got)
	}
}
