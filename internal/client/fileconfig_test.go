package client

import (
	"os"
	"path/filepath"
	"testing"
)

func TestResolveConfigPrecedence(t *testing.T) {
	verbose := true
	file := FileConfig{
		Server:    "wss://file.example/tunnel",
		Host:      "127.0.0.1",
		Subdomain: "from-file",
		Token:     "file-token",
		Verbose:   &verbose,
	}
	t.Setenv("OPENHOLE_SERVER_URL", "wss://env.example/tunnel")
	t.Setenv("OPENHOLE_TOKEN", "env-token")

	cfg := ResolveConfig(file, 3000, "localhost", "cli-sub", "wss://flag.example/tunnel", "flag-token", false, true)
	if cfg.ServerURL != "wss://flag.example/tunnel" {
		t.Fatalf("server: %q", cfg.ServerURL)
	}
	if cfg.Host != "localhost" {
		t.Fatalf("host: %q", cfg.Host)
	}
	if cfg.Subdomain != "cli-sub" {
		t.Fatalf("subdomain: %q", cfg.Subdomain)
	}
	if cfg.Token != "flag-token" {
		t.Fatalf("token: %q", cfg.Token)
	}
	if cfg.Verbose {
		t.Fatal("expected verbose false when flag set")
	}

	cfg = ResolveConfig(file, 3000, "", "", "", "", false, false)
	if cfg.ServerURL != "wss://env.example/tunnel" {
		t.Fatalf("server from env: %q", cfg.ServerURL)
	}
	if cfg.Token != "env-token" {
		t.Fatalf("token from env: %q", cfg.Token)
	}
	if !cfg.Verbose {
		t.Fatal("expected verbose from file")
	}

	t.Setenv("OPENHOLE_SERVER_URL", "")
	t.Setenv("OPENHOLE_TOKEN", "")
	cfg = ResolveConfig(file, 3000, "", "", "", "", false, false)
	if cfg.ServerURL != "wss://file.example/tunnel" {
		t.Fatalf("server from file: %q", cfg.ServerURL)
	}
	if cfg.Token != "file-token" {
		t.Fatalf("token from file: %q", cfg.Token)
	}
}

func TestLoadFileConfigMissing(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "missing.yaml")
	_, err := LoadFileConfig(path)
	if err != nil {
		t.Fatalf("missing config should not error: %v", err)
	}
}

func TestLoadFileConfig(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "config.yaml")
	if err := os.WriteFile(path, []byte("server: wss://x/tunnel\nhost: app\n"), 0o600); err != nil {
		t.Fatal(err)
	}
	cfg, err := LoadFileConfig(path)
	if err != nil {
		t.Fatal(err)
	}
	if cfg.Server != "wss://x/tunnel" || cfg.Host != "app" {
		t.Fatalf("unexpected: %+v", cfg)
	}
}
