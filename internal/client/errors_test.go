package client

import "testing"

func TestValidateServerURL(t *testing.T) {
	tests := []struct {
		url    string
		wantOK bool
	}{
		{"wss://tunnel.openhole.dev/tunnel", true},
		{"ws://127.0.0.1:8080/tunnel", true},
		{"ws://localhost:8080/tunnel", true},
		{"ws://tunnel.example.com/tunnel", false},
	}
	for _, tc := range tests {
		err := validateServerURL(tc.url)
		if tc.wantOK && err != nil {
			t.Fatalf("validateServerURL(%q) unexpected error: %v", tc.url, err)
		}
		if !tc.wantOK && err == nil {
			t.Fatalf("validateServerURL(%q) expected error", tc.url)
		}
	}
}

func TestIsReconnectable(t *testing.T) {
	tests := []struct {
		err  string
		want bool
	}{
		{"connection reset by peer", true},
		{"subdomain \"myapp\" is already in use", false},
		{"subdomain \"admin\" is not allowed", false},
		{"insecure WebSocket URL (ws://); use wss:// for remote servers", false},
	}

	for _, tc := range tests {
		got := isReconnectable(testError(tc.err))
		if got != tc.want {
			t.Fatalf("isReconnectable(%q) = %v, want %v", tc.err, got, tc.want)
		}
	}
}

type testError string

func (e testError) Error() string { return string(e) }
