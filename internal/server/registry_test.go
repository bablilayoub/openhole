package server

import (
	"testing"
	"time"

	"github.com/bablilayoub/openhole/internal/shared"
)

func newTestTunnel(subdomain, ip string) *Tunnel {
	return &Tunnel{
		ID:        "test-id",
		Subdomain: subdomain,
		ClientIP:  ip,
		Pending:   make(map[string]chan tunnelResponse),
		sem:       make(chan struct{}, 10),
	}
}

func TestRegistryRegisterAndAvailability(t *testing.T) {
	r := NewRegistry(30)
	tunnel := newTestTunnel("blue-fox", "10.0.0.1")

	if !r.IsAvailable("blue-fox") {
		t.Fatal("expected subdomain to be available")
	}

	if err := r.Register(tunnel); err != nil {
		t.Fatalf("register: %v", err)
	}

	if r.IsAvailable("blue-fox") {
		t.Fatal("expected subdomain to be unavailable after register")
	}

	got, ok := r.GetBySubdomain("blue-fox")
	if !ok || got.ClientIP != "10.0.0.1" {
		t.Fatalf("get by subdomain failed: ok=%v", ok)
	}

	r.Unregister("blue-fox")
	if _, ok := r.GetBySubdomain("blue-fox"); ok {
		t.Fatal("expected tunnel to be removed after unregister")
	}
	if r.IsAvailable("blue-fox") {
		t.Fatal("expected hold to block immediate re-registration")
	}
}

func TestRegistryIPLimit(t *testing.T) {
	r := NewRegistry(1)
	const maxPerIP = 1

	for i := 0; i < 2; i++ {
		tunnel := newTestTunnel(shared.RandomSubdomain(), "192.168.1.5")
		sub, err := r.AssignSubdomain("", "192.168.1.5", "")
		if err != nil {
			t.Fatalf("assign subdomain: %v", err)
		}
		tunnel.Subdomain = sub

		err = r.RegisterWithIPLimit(tunnel, maxPerIP, "")
		if i == 0 && err != nil {
			t.Fatalf("first register should succeed: %v", err)
		}
		if i == 1 && err == nil {
			t.Fatal("second register from same IP should fail")
		}
	}
}

func TestRegistryExpiredHold(t *testing.T) {
	r := NewRegistry(1)
	tunnel := newTestTunnel("quick-fox", "10.0.0.2")

	if err := r.Register(tunnel); err != nil {
		t.Fatalf("register: %v", err)
	}
	r.Unregister("quick-fox")

	r.mu.Lock()
	r.holds["quick-fox"] = holdEntry{until: time.Now().Add(-time.Second), clientIP: "10.0.0.2", tokenHash: ""}
	r.mu.Unlock()

	r.CleanupExpiredHolds()
	if !r.IsAvailable("quick-fox") {
		t.Fatal("expected hold to expire")
	}
}

func TestRegistrySameIPReclaimsSubdomainDuringHold(t *testing.T) {
	r := NewRegistry(30)
	tunnel := newTestTunnel("my-app", "10.0.0.9")

	if err := r.Register(tunnel); err != nil {
		t.Fatalf("register: %v", err)
	}
	r.Unregister("my-app")

	if !r.IsAvailableFor("my-app", "10.0.0.9", "") {
		t.Fatal("same IP should reclaim subdomain during hold")
	}
	if r.IsAvailableFor("my-app", "10.0.0.10", "") {
		t.Fatal("different IP should not claim subdomain during hold")
	}
}

func TestRegistryReclaimTokenAllowsNewIP(t *testing.T) {
	r := NewRegistry(300)
	tunnel := newTestTunnel("webhook-app", "10.0.0.1")

	if err := r.Register(tunnel); err != nil {
		t.Fatalf("register: %v", err)
	}
	token := r.IssueReclaimToken(tunnel, true)
	if token == "" {
		t.Fatal("expected reclaim token")
	}
	r.Unregister("webhook-app")

	if r.IsAvailableFor("webhook-app", "10.0.0.99", "") {
		t.Fatal("different IP without token should not claim subdomain during hold")
	}
	if !r.IsAvailableFor("webhook-app", "10.0.0.99", token) {
		t.Fatal("reclaim token should allow new IP during hold")
	}

	tunnel2 := newTestTunnel("webhook-app", "10.0.0.99")
	if err := r.RegisterWithIPLimit(tunnel2, 10, token); err != nil {
		t.Fatalf("register with token: %v", err)
	}
}

func TestTunnelCloseAllPendingReleasesSemaphore(t *testing.T) {
	tunnel := newTestTunnel("busy-fox", "10.0.0.3")
	tunnel.sem <- struct{}{}

	ch := make(chan tunnelResponse, 1)
	tunnel.Pending["req-1"] = ch

	tunnel.closeAllPending(shared.ErrRequestTimeout)

	if len(tunnel.sem) != 0 {
		t.Fatalf("expected semaphore slot released, got %d buffered", len(tunnel.sem))
	}
}
