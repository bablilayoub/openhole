package client

import (
	"encoding/base64"
	"net"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"

	"github.com/bablilayoub/openhole/internal/protocol"
)

func TestForwardToLocal(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" || r.URL.Path != "/api/test" {
			t.Fatalf("unexpected request: %s %s", r.Method, r.URL.Path)
		}
		if r.Header.Get("X-Forwarded-For") != "" {
			t.Fatal("forwarded header should be stripped before local request")
		}
		w.Header().Set("X-Powered-By", "test")
		w.WriteHeader(http.StatusCreated)
		_, _ = w.Write([]byte(`{"ok":true}`))
	}))
	defer srv.Close()

	host, portStr, err := net.SplitHostPort(srv.Listener.Addr().String())
	if err != nil {
		t.Fatal(err)
	}
	port, err := strconv.Atoi(portStr)
	if err != nil {
		t.Fatal(err)
	}

	req := protocol.RequestMessage{
		Type:      protocol.TypeRequest,
		RequestID: "req-1",
		Method:    "POST",
		Path:      "/api/test",
		Headers: map[string][]string{
			"X-Forwarded-For": {"1.2.3.4"},
			"Content-Type":    {"application/json"},
		},
		BodyBase64: base64.StdEncoding.EncodeToString([]byte(`{}`)),
	}

	resp, _, err := ForwardToLocal(req, host, port)
	if err != nil {
		t.Fatal(err)
	}
	if resp.StatusCode != http.StatusCreated {
		t.Fatalf("status: %d", resp.StatusCode)
	}
	body, _ := base64.StdEncoding.DecodeString(resp.BodyBase64)
	if string(body) != `{"ok":true}` {
		t.Fatalf("body: %s", body)
	}
}

func TestForwardToLocalPreservesEscapedPath(t *testing.T) {
	var gotRequestURI string

	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		gotRequestURI = r.RequestURI
		w.WriteHeader(http.StatusOK)
	}))
	defer srv.Close()

	host, portStr, err := net.SplitHostPort(srv.Listener.Addr().String())
	if err != nil {
		t.Fatal(err)
	}
	port, err := strconv.Atoi(portStr)
	if err != nil {
		t.Fatal(err)
	}

	req := protocol.RequestMessage{
		Type:      protocol.TypeRequest,
		RequestID: "req-encoded",
		Method:    "GET",
		Path:      "/%2e%2e/secret.txt",
	}

	if _, _, err := ForwardToLocal(req, host, port); err != nil {
		t.Fatal(err)
	}
	if gotRequestURI != "/%2e%2e/secret.txt" {
		t.Fatalf("RequestURI = %q, want %q", gotRequestURI, "/%2e%2e/secret.txt")
	}
}

func TestForwardToLocalPreservesEncodedSlash(t *testing.T) {
	var gotRequestURI string

	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		gotRequestURI = r.RequestURI
		w.WriteHeader(http.StatusOK)
	}))
	defer srv.Close()

	host, portStr, err := net.SplitHostPort(srv.Listener.Addr().String())
	if err != nil {
		t.Fatal(err)
	}
	port, err := strconv.Atoi(portStr)
	if err != nil {
		t.Fatal(err)
	}

	req := protocol.RequestMessage{
		Type:      protocol.TypeRequest,
		RequestID: "req-slash",
		Method:    "GET",
		Path:      "/a%2fb",
	}

	if _, _, err := ForwardToLocal(req, host, port); err != nil {
		t.Fatal(err)
	}
	if gotRequestURI != "/a%2fb" {
		t.Fatalf("RequestURI = %q, want %q", gotRequestURI, "/a%2fb")
	}
}

func TestForwardToLocalRejectsAbsolutePath(t *testing.T) {
	req := protocol.RequestMessage{
		Type:      protocol.TypeRequest,
		RequestID: "req-abs",
		Method:    "GET",
		Path:      "http://169.254.169.254/",
	}
	_, _, err := ForwardToLocal(req, "127.0.0.1", 8080)
	if err == nil {
		t.Fatal("expected error for absolute path")
	}
}
