package shared

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestIsWebSocketUpgrade(t *testing.T) {
	r := httptest.NewRequest("GET", "/ws", nil)
	r.Header.Set("Upgrade", "websocket")
	r.Header.Set("Connection", "Upgrade")
	if !IsWebSocketUpgrade(r) {
		t.Fatal("expected websocket upgrade")
	}

	r.Header.Set("Connection", "keep-alive, Upgrade")
	if !IsWebSocketUpgrade(r) {
		t.Fatal("expected upgrade with multiple connection tokens")
	}

	r.Header.Set("Upgrade", "h2c")
	if IsWebSocketUpgrade(r) {
		t.Fatal("expected non-websocket upgrade to be rejected")
	}
}

func TestWebSocketHandshakeHeaders(t *testing.T) {
	r := httptest.NewRequest("GET", "/ws", nil)
	r.Header.Set("Upgrade", "websocket")
	r.Header.Set("Connection", "Upgrade")
	r.Header.Set("Sec-WebSocket-Key", "dGhlIHNhbXBsZSBub25jZQ==")
	r.Header.Set("Sec-WebSocket-Version", "13")
	r.Header.Set("X-Forwarded-For", "1.2.3.4")

	got := WebSocketHandshakeHeaders(r.Header)
	if got["Sec-Websocket-Key"][0] != "dGhlIHNhbXBsZSBub25jZQ==" {
		t.Fatalf("key not preserved: %+v", got)
	}
	if _, ok := got["X-Forwarded-For"]; ok {
		t.Fatal("forwarded header should not be in handshake copy")
	}
}

func TestWebSocketResponseHeaders(t *testing.T) {
	h := http.Header{}
	h.Set("Upgrade", "websocket")
	h.Set("Connection", "Upgrade")
	h.Set("Sec-WebSocket-Accept", "accept")
	h.Set("X-Powered-By", "test")

	got := WebSocketResponseHeaders(h)
	if got["Sec-Websocket-Accept"][0] != "accept" {
		t.Fatalf("accept: %+v", got)
	}
	if _, ok := got["X-Powered-By"]; ok {
		t.Fatal("unexpected header copied")
	}
}
