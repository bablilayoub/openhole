package shared

import (
	"encoding/base64"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestParseBasicAuthCredentials(t *testing.T) {
	user, pass, err := ParseBasicAuthCredentials("demo:se:cret")
	if err != nil {
		t.Fatal(err)
	}
	if user != "demo" || pass != "se:cret" {
		t.Fatalf("got %q %q", user, pass)
	}
	for _, bad := range []string{"nocolon", ":pass", "user:", "", "us\ner:pass"} {
		if _, _, err := ParseBasicAuthCredentials(bad); err == nil {
			t.Fatalf("expected error for %q", bad)
		}
	}
}

func TestBasicAuthMatch(t *testing.T) {
	auth := NewBasicAuth("demo", "secret")

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	if auth.Match(req) {
		t.Fatal("missing credentials should fail")
	}

	req.SetBasicAuth("demo", "secret")
	if !auth.Match(req) {
		t.Fatal("correct credentials should pass")
	}

	req.SetBasicAuth("demo", "wrong")
	if auth.Match(req) {
		t.Fatal("wrong password should fail")
	}

	req.SetBasicAuth("other", "secret")
	if auth.Match(req) {
		t.Fatal("wrong user should fail")
	}

	// RFC 7235: the scheme is case-insensitive.
	cred := base64.StdEncoding.EncodeToString([]byte("demo:secret"))
	req.Header.Set("Authorization", "basic "+cred)
	if !auth.Match(req) {
		t.Fatal("lowercase scheme should pass")
	}

	req.Header.Set("Authorization", "Bearer "+cred)
	if auth.Match(req) {
		t.Fatal("non-Basic scheme should fail")
	}

	var open *BasicAuth
	req.Header.Del("Authorization")
	if !open.Match(req) {
		t.Fatal("nil auth means open tunnel")
	}
}

func TestStripAuthorization(t *testing.T) {
	h := map[string][]string{
		"authorization": {"Basic xxx"},
		"Accept":        {"*/*"},
	}
	StripAuthorization(h)
	if _, ok := h["authorization"]; ok {
		t.Fatal("authorization should be stripped regardless of case")
	}
	if len(h["Accept"]) != 1 {
		t.Fatal("accept should remain")
	}
}
