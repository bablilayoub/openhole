package client

import (
	"os"
	"path/filepath"
)

func configDir() (string, error) {
	if v := os.Getenv("OPENHOLE_CONFIG_DIR"); v != "" {
		return v, nil
	}
	dir, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(dir, "openhole"), nil
}

func sessionPath() (string, error) {
	dir, err := configDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(dir, "session.json"), nil
}
