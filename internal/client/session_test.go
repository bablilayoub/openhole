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
	if err := saveSession(s); err != nil {
		t.Fatalf("saveSession: %v", err)
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

func TestClearStaleSession(t *testing.T) {
	dir := t.TempDir()
	t.Setenv("OPENHOLE_CONFIG_DIR", filepath.Join(dir, "openhole"))

	path, err := sessionPath()
	if err != nil {
		t.Fatalf("sessionPath: %v", err)
	}
	if err := os.MkdirAll(filepath.Dir(path), 0o700); err != nil {
		t.Fatalf("mkdir: %v", err)
	}
	data, _ := json.Marshal(Session{PID: 999999, PublicURL: "https://dead.ophl.link"})
	if err := os.WriteFile(path, data, 0o600); err != nil {
		t.Fatalf("write: %v", err)
	}

	clearStaleSession()
	if _, ok := loadSession(); ok {
		t.Fatal("expected stale session removed")
	}
}
