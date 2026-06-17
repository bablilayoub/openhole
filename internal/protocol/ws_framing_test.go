package protocol

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gorilla/websocket"
)

func TestWSFrameRoundTrip(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		up := websocket.Upgrader{CheckOrigin: func(*http.Request) bool { return true }}
		conn, err := up.Upgrade(w, r, nil)
		if err != nil {
			t.Fatal(err)
		}
		defer conn.Close()

		msg, err := ReadTunnelMessage(conn)
		if err != nil {
			t.Fatal(err)
		}
		if msg.WSFrame == nil {
			t.Fatal("expected ws frame")
		}
		if msg.WSFrame.StreamID != "11111111-2222-4333-8444-555555555555" {
			t.Fatalf("stream id: %q", msg.WSFrame.StreamID)
		}
		if string(msg.WSFrame.Payload) != "hello" {
			t.Fatalf("payload: %q", msg.WSFrame.Payload)
		}
	}))
	defer srv.Close()

	wsURL := "ws" + srv.URL[len("http"):]
	client, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
	if err != nil {
		t.Fatal(err)
	}
	defer client.Close()

	if err := WriteWSFrame(client, "11111111-2222-4333-8444-555555555555", 1, []byte("hello")); err != nil {
		t.Fatal(err)
	}
}

func TestParseWSOpenMessages(t *testing.T) {
	raw := []byte(`{"type":"ws_open","stream_id":"11111111-2222-4333-8444-555555555555","method":"GET","path":"/ws","query":"","headers":{"Sec-Websocket-Key":["abc"]}}`)
	msg, err := ParseWSOpen(raw)
	if err != nil {
		t.Fatal(err)
	}
	if msg.Path != "/ws" || msg.Method != "GET" {
		t.Fatalf("unexpected open: %+v", msg)
	}
}
