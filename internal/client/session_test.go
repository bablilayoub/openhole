package client

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
	"time"
)

func TestSessionSaveLoadClear(t *testing.T) {
	dir := t.TempDir()
	t.Setenv("OPENHOLE_CONFIG_DIR", filepath.Join(dir, "openhole"))

	s := Session{
		PID:       os.Getpid(),
		PublicURL: "https://myapp.ophl.link",
		Subdomain: "myapp",
		Host:      "localhost",
		Port:      3000,
		ServerURL: "wss://tunnel.example.com/tunnel",
		StartedAt: time.Now().UTC().Truncate(time.Second),
	}
	if err := saveSessionEntry(s); err != nil {
		t.Fatalf("saveSessionEntry: %v", err)
	}

	got, ok := loadSession()
	if !ok {
		t.Fatal("loadSession returned false")
	}
	if got.PublicURL != s.PublicURL || got.Port != s.Port {
		t.Fatalf("loadSession mismatch: %+v", got)
	}

	clearSession()
	if _, ok := loadSession(); ok {
		t.Fatal("expected session cleared")
	}
}

func TestMultiSessionStore(t *testing.T) {
	dir := t.TempDir()
	t.Setenv("OPENHOLE_CONFIG_DIR", filepath.Join(dir, "openhole"))

	s1 := Session{PID: os.Getpid(), Port: 3000, PublicURL: "https://a.ophl.link"}
	s2 := Session{PID: os.Getpid(), Port: 8080, PublicURL: "https://b.ophl.link"}
	if err := saveSessionEntry(s1); err != nil {
		t.Fatal(err)
	}
	if err := saveSessionEntry(s2); err != nil {
		t.Fatal(err)
	}
	active := loadActiveSessions()
	if len(active) != 2 {
		t.Fatalf("expected 2 sessions, got %d", len(active))
	}
	clearSessionsForPort(3000)
	active = loadActiveSessions()
	if len(active) != 1 || active[0].Port != 8080 {
		t.Fatalf("unexpected after clear: %+v", active)
	}
}

func TestClearStaleSession(t *testing.T) {
	dir := t.TempDir()
	t.Setenv("OPENHOLE_CONFIG_DIR", filepath.Join(dir, "openhole"))

	path := filepath.Join(dir, "openhole", "session.json")
	if err := os.MkdirAll(filepath.Dir(path), 0o700); err != nil {
		t.Fatalf("mkdir: %v", err)
	}
	data, _ := json.Marshal(Session{PID: 999999, PublicURL: "https://dead.ophl.link"})
	if err := os.WriteFile(path, data, 0o600); err != nil {
		t.Fatalf("write: %v", err)
	}

	clearStaleSessions()
	if _, ok := loadSession(); ok {
		t.Fatal("expected stale session removed")
	}
}
