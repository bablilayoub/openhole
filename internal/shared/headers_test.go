package shared

import (
	"net/http"
	"testing"
)

func TestSanitizeIncomingHTTPHeaders(t *testing.T) {
	h := http.Header{}
	h.Set("Content-Type", "application/json")
	h.Set("X-Forwarded-For", "1.2.3.4")
	h.Set("CF-Connecting-IP", "9.9.9.9")
	h.Set("Content-Length", "42")
	h.Set("Connection", "keep-alive")
	h.Set("X-Custom", "ok")

	out := SanitizeIncomingHTTPHeaders(h)

	if _, ok := out["X-Forwarded-For"]; ok {
		t.Fatal("X-Forwarded-For should be stripped")
	}
	if _, ok := out["Cf-Connecting-Ip"]; ok {
		t.Fatal("CF-Connecting-IP should be stripped")
	}
	if _, ok := out["Content-Length"]; ok {
		t.Fatal("Content-Length should be stripped")
	}
	if _, ok := out["Connection"]; ok {
		t.Fatal("Connection should be stripped")
	}
	if got := out["X-Custom"]; len(got) != 1 || got[0] != "ok" {
		t.Fatalf("X-Custom should be preserved, got %v", out["X-Custom"])
	}
	if got := out["Content-Type"]; len(got) != 1 || got[0] != "application/json" {
		t.Fatalf("Content-Type should be preserved, got %v", out["Content-Type"])
	}
}

func TestSanitizeResponseHeaders(t *testing.T) {
	in := map[string][]string{
		"Content-Type":      {"text/plain"},
		"Transfer-Encoding": {"chunked"},
	}
	out := SanitizeResponseHeaders(in)
	if _, ok := out["Transfer-Encoding"]; ok {
		t.Fatal("hop-by-hop response header should be stripped")
	}
	if got := out["Content-Type"]; len(got) != 1 || got[0] != "text/plain" {
		t.Fatalf("Content-Type should be preserved, got %v", out["Content-Type"])
	}
}
