package server

import (
	"net/http/httptest"
	"testing"
)

func testConfig() Config {
	return Config{
		MaxRegistrationsPerIPPerMinute:  3,
		MaxPublicRequestsPerIPPerMinute: 5,
		BlockedIPs:                      map[string]struct{}{"10.0.0.99": {}},
	}
}

func TestLimitsBlockedIP(t *testing.T) {
	l := NewLimits(testConfig())
	if l.AllowRegistrationRate("10.0.0.99") {
		t.Fatal("blocked IP should not register")
	}
	if l.AllowPublicRequest("10.0.0.99") {
		t.Fatal("blocked IP should not make public requests")
	}
}

func TestLimitsRegistrationRate(t *testing.T) {
	l := NewLimits(testConfig())
	ip := "192.168.1.1"

	for i := 0; i < 3; i++ {
		if !l.AllowRegistrationRate(ip) {
			t.Fatalf("registration %d should be allowed", i+1)
		}
	}
	if l.AllowRegistrationRate(ip) {
		t.Fatal("4th registration should be rate limited")
	}
}

func TestLimitsPublicRequestRate(t *testing.T) {
	l := NewLimits(testConfig())
	ip := "192.168.1.2"

	for i := 0; i < 5; i++ {
		if !l.AllowPublicRequest(ip) {
			t.Fatalf("request %d should be allowed", i+1)
		}
	}
	if l.AllowPublicRequest(ip) {
		t.Fatal("6th request should be rate limited")
	}
}

func TestClientIP(t *testing.T) {
	req := httptest.NewRequest("GET", "/", nil)
	req.RemoteAddr = "203.0.113.5:12345"

	if got := ClientIP(req, false); got != "203.0.113.5" {
		t.Fatalf("without proxy: got %q", got)
	}

	req.Header.Set("X-Forwarded-For", "1.2.3.4, 5.6.7.8")
	if got := ClientIP(req, true); got != "1.2.3.4" {
		t.Fatalf("with proxy: got %q", got)
	}
}
