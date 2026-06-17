package client

import (
	"encoding/json"
	"os"
	"path/filepath"
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

type sessionStore struct {
	Sessions []Session `json:"sessions"`
}

func sessionsPath() (string, error) {
	dir, err := configDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(dir, "sessions.json"), nil
}

func loadSessionStore() sessionStore {
	path, err := sessionsPath()
	if err != nil {
		return sessionStore{}
	}
	data, err := os.ReadFile(path)
	if err != nil {
		if legacy, ok := loadLegacySession(); ok {
			return sessionStore{Sessions: []Session{legacy}}
		}
		return sessionStore{}
	}
	var store sessionStore
	if err := json.Unmarshal(data, &store); err != nil {
		return sessionStore{}
	}
	return store
}

func loadLegacySession() (Session, bool) {
	dir, err := configDir()
	if err != nil {
		return Session{}, false
	}
	path := filepath.Join(dir, "session.json")
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

func saveSessionStore(store sessionStore) error {
	path, err := sessionsPath()
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(path), 0o700); err != nil {
		return err
	}
	data, err := json.Marshal(store)
	if err != nil {
		return err
	}
	return os.WriteFile(path, data, 0o600)
}

func saveSessionEntry(s Session) error {
	store := loadSessionStore()
	found := false
	for i, existing := range store.Sessions {
		if existing.Port == s.Port && existing.PID == s.PID {
			store.Sessions[i] = s
			found = true
			break
		}
	}
	if !found {
		store.Sessions = append(store.Sessions, s)
	}
	return saveSessionStore(store)
}

func loadSessionForPort(port int) (Session, bool) {
	store := loadSessionStore()
	for _, s := range store.Sessions {
		if s.Port == port && s.PID == os.Getpid() {
			return s, true
		}
	}
	return Session{}, false
}

func loadActiveSessions() []Session {
	store := loadSessionStore()
	var active []Session
	for _, s := range store.Sessions {
		if processAlive(s.PID) {
			active = append(active, s)
		}
	}
	return active
}

func clearSessionsForPort(port int) {
	store := loadSessionStore()
	pid := os.Getpid()
	out := store.Sessions[:0]
	for _, s := range store.Sessions {
		if s.Port == port && s.PID == pid {
			continue
		}
		out = append(out, s)
	}
	store.Sessions = out
	if len(store.Sessions) == 0 {
		clearSessionsFile()
		return
	}
	_ = saveSessionStore(store)
}

func clearSessionsFile() {
	path, err := sessionsPath()
	if err != nil {
		return
	}
	_ = os.Remove(path)
	// Remove legacy file if present.
	if dir, err := configDir(); err == nil {
		_ = os.Remove(filepath.Join(dir, "session.json"))
	}
}

func clearStaleSessions() {
	store := loadSessionStore()
	if len(store.Sessions) == 0 {
		if legacy, ok := loadLegacySession(); ok {
			store.Sessions = []Session{legacy}
		}
	}
	out := store.Sessions[:0]
	for _, s := range store.Sessions {
		if processAlive(s.PID) {
			out = append(out, s)
		}
	}
	store.Sessions = out
	if len(store.Sessions) == 0 {
		clearSessionsFile()
		return
	}
	_ = saveSessionStore(store)
}

// loadSession returns the first active session (backward compat for single-tunnel).
func loadSession() (Session, bool) {
	active := loadActiveSessions()
	if len(active) == 0 {
		return Session{}, false
	}
	return active[0], true
}

func clearSession() {
	clearSessionsFile()
}
