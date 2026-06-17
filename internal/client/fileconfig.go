package client

import (
	"os"
	"path/filepath"

	"gopkg.in/yaml.v3"
)

// FileConfig holds defaults loaded from ~/.config/openhole/config.yaml.
type FileConfig struct {
	Server    string `yaml:"server"`
	Host      string `yaml:"host"`
	Subdomain string `yaml:"subdomain"`
	Token     string `yaml:"token"`
	Verbose   *bool  `yaml:"verbose"`
}

func configFilePath() (string, error) {
	dir, err := configDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(dir, "config.yaml"), nil
}

func LoadFileConfig(path string) (FileConfig, error) {
	if path == "" {
		var err error
		path, err = configFilePath()
		if err != nil {
			return FileConfig{}, err
		}
	}
	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return FileConfig{}, nil
		}
		return FileConfig{}, err
	}
	var cfg FileConfig
	if err := yaml.Unmarshal(data, &cfg); err != nil {
		return FileConfig{}, err
	}
	return cfg, nil
}

// ResolveConfig merges defaults, config file, environment, and CLI flags (flags win).
func ResolveConfig(file FileConfig, port int, host, subdomain, serverURL, token string, verbose bool, verboseSet bool) Config {
	if host == "" {
		host = file.Host
	}
	if host == "" {
		host = "localhost"
	}
	if subdomain == "" {
		subdomain = file.Subdomain
	}
	if serverURL == "" {
		if v := os.Getenv("OPENHOLE_SERVER_URL"); v != "" {
			serverURL = v
		} else if file.Server != "" {
			serverURL = file.Server
		}
	}
	if serverURL == "" {
		serverURL = "wss://tunnel.openhole.dev/tunnel"
	}
	if token == "" {
		if v := os.Getenv("OPENHOLE_TOKEN"); v != "" {
			token = v
		} else if file.Token != "" {
			token = file.Token
		}
	}
	if !verboseSet && file.Verbose != nil {
		verbose = *file.Verbose
	}
	return Config{
		Port:      port,
		Host:      host,
		Subdomain: subdomain,
		ServerURL: serverURL,
		Token:     token,
		Verbose:   verbose,
	}
}
