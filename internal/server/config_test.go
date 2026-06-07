package server

import (
	"os"
	"testing"
)

func TestPublicURL(t *testing.T) {
	cfg := Config{
		PublicURLScheme:    "https",
		PublicTunnelDomain: "ophl.link",
	}
	if got := cfg.PublicURL("blue-fox"); got != "https://blue-fox.ophl.link" {
		t.Fatalf("got %q", got)
	}
}

func TestLoadConfigDefaults(t *testing.T) {
	os.Unsetenv("PUBLIC_TUNNEL_DOMAIN")
	os.Unsetenv("TRUST_PROXY_HEADERS")
	os.Unsetenv("BLOCKED_IPS")

	cfg := LoadConfig()
	if cfg.PublicTunnelDomain != "ophl.link" {
		t.Fatalf("domain: %q", cfg.PublicTunnelDomain)
	}
	if cfg.TrustProxyHeaders {
		t.Fatal("TRUST_PROXY_HEADERS should default to false")
	}
	if cfg.MaxBodyBytes != 10*1024*1024 {
		t.Fatalf("max body: %d", cfg.MaxBodyBytes)
	}
}

func TestParseBlockedIPs(t *testing.T) {
	m := parseBlockedIPs(" 1.2.3.4 , 5.6.7.8, ")
	if len(m) != 2 {
		t.Fatalf("expected 2 IPs, got %d", len(m))
	}
	if _, ok := m["1.2.3.4"]; !ok {
		t.Fatal("missing 1.2.3.4")
	}
}
