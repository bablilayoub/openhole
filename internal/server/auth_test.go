package server

import "testing"

func TestRegistrationTokenValid(t *testing.T) {
	cfg := Config{
		RegistrationTokens: parseRegistrationTokens("alpha,beta"),
	}
	if !cfg.registrationTokenValid("alpha") {
		t.Fatal("expected alpha valid")
	}
	if cfg.registrationTokenValid("wrong") {
		t.Fatal("expected wrong invalid")
	}

	open := Config{}
	if !open.registrationTokenValid("") {
		t.Fatal("open server should allow empty token")
	}
	if !open.registrationTokenValid("anything") {
		t.Fatal("open server should allow any token when unset")
	}
}

func TestParseRegistrationTokens(t *testing.T) {
	m := parseRegistrationTokens(" one , two, ")
	if len(m) != 2 {
		t.Fatalf("expected 2 tokens, got %d", len(m))
	}
	if _, ok := m["one"]; !ok {
		t.Fatal("missing one")
	}
}
