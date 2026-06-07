package server

import (
	"net/http/httptest"
	"testing"
)

func TestHostWithoutPort(t *testing.T) {
	tests := []struct {
		in   string
		want string
	}{
		{"example.com", "example.com"},
		{"example.com:443", "example.com"},
		{"[::1]:8080", "::1"},
		{"localhost:8080", "localhost"},
	}

	for _, tc := range tests {
		if got := hostWithoutPort(tc.in); got != tc.want {
			t.Errorf("hostWithoutPort(%q) = %q, want %q", tc.in, got, tc.want)
		}
	}
}

func TestParseTunnelHost(t *testing.T) {
	s := &Server{cfg: Config{
		PublicTunnelDomain: "ophl.link",
		TunnelEndpointHost: "tunnel.example.com",
	}}

	tests := []struct {
		host       string
		wantSub    string
		wantTunnel bool
		wantDomain bool
	}{
		{"tunnel.example.com", "", true, false},
		{"tunnel.example.com:443", "", true, false},
		{"[::1]:8080", "", true, false},
		{"blue-fox.ophl.link", "blue-fox", false, true},
		{"ophl.link", "", false, true},
		{"evil.com", "", false, false},
		{"a.b.ophl.link", "", false, true},
	}

	for _, tc := range tests {
		req := httptest.NewRequest("GET", "/", nil)
		req.Host = tc.host
		sub, isTunnel, isDomain := s.parseTunnelHost(req)
		if sub != tc.wantSub || isTunnel != tc.wantTunnel || isDomain != tc.wantDomain {
			t.Errorf("parseTunnelHost(%q) = (%q, %v, %v), want (%q, %v, %v)",
				tc.host, sub, isTunnel, isDomain, tc.wantSub, tc.wantTunnel, tc.wantDomain)
		}
	}
}
