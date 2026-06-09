package client

import (
	"encoding/json"
	"os"
	"path/filepath"
	"syscall"
	"time"
)

type Session struct {
	PID       int       `json:"pid"`
	PublicURL string    `json:"public_url"`
	Subdomain string    `json:"subdomain"`
	Host      string    `json:"host"`
	Port      int       `json:"port"`
	ServerURL string    `json:"server_url"`
	StartedAt time.Time `json:"started_at"`
}

func saveSession(s Session) error {
	path, err := sessionPath()
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(path), 0o700); err != nil {
		return err
	}
	data, err := json.Marshal(s)
	if err != nil {
		return err
	}
	return os.WriteFile(path, data, 0o600)
}

func loadSession() (Session, bool) {
	path, err := sessionPath()
	if err != nil {
		return Session{}, false
	}
	data, err := os.ReadFile(path)
	if err != nil {
		return Session{}, false
	}
	var s Session
	if err := json.Unmarshal(data, &s); err != nil {
		return Session{}, false
	}
	return s, true
}

func clearSession() {
	path, err := sessionPath()
	if err != nil {
		return
	}
	_ = os.Remove(path)
}

func clearStaleSession() {
	s, ok := loadSession()
	if !ok {
		return
	}
	if !processAlive(s.PID) {
		clearSession()
	}
}

func processAlive(pid int) bool {
	if pid <= 0 {
		return false
	}
	proc, err := os.FindProcess(pid)
	if err != nil {
		return false
	}
	return proc.Signal(syscall.Signal(0)) == nil
}
