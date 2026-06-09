package client

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sync"
)

type reclaimStore struct {
	Tokens map[string]string `json:"tokens"`
}

var reclaimMu sync.Mutex

func reclaimStorePath() (string, error) {
	dir, err := configDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(dir, "reclaim.json"), nil
}

func loadReclaimToken(subdomain string) string {
	reclaimMu.Lock()
	defer reclaimMu.Unlock()

	path, err := reclaimStorePath()
	if err != nil {
		return ""
	}
	data, err := os.ReadFile(path)
	if err != nil {
		return ""
	}
	var store reclaimStore
	if err := json.Unmarshal(data, &store); err != nil || store.Tokens == nil {
		return ""
	}
	return store.Tokens[subdomain]
}

func saveReclaimToken(subdomain, token string) error {
	if subdomain == "" || token == "" {
		return nil
	}

	reclaimMu.Lock()
	defer reclaimMu.Unlock()

	dir, err := configDir()
	if err != nil {
		return err
	}
	if err := os.MkdirAll(dir, 0o700); err != nil {
		return err
	}
	path, err := reclaimStorePath()
	if err != nil {
		return err
	}

	store := reclaimStore{Tokens: map[string]string{}}
	if data, err := os.ReadFile(path); err == nil {
		_ = json.Unmarshal(data, &store)
	}
	if store.Tokens == nil {
		store.Tokens = map[string]string{}
	}
	store.Tokens[subdomain] = token

	data, err := json.Marshal(store)
	if err != nil {
		return err
	}
	return os.WriteFile(path, data, 0o600)
}
