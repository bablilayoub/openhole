package client

import (
	"fmt"
	neturl "net/url"
	"strings"
)

func validateServerURL(raw string) error {
	lower := strings.ToLower(strings.TrimSpace(raw))
	if !strings.HasPrefix(lower, "ws://") {
		return nil
	}
	u, err := neturl.Parse(raw)
	if err != nil {
		return fmt.Errorf("invalid server URL: %w", err)
	}
	switch u.Hostname() {
	case "localhost", "127.0.0.1", "::1":
		return nil
	default:
		return fmt.Errorf("insecure WebSocket URL (ws://); use wss:// for remote servers")
	}
}

func isReconnectable(err error) bool {
	if err == nil {
		return true
	}
	msg := strings.ToLower(err.Error())
	switch {
	case strings.Contains(msg, "already in use"),
		strings.Contains(msg, "not allowed"),
		strings.Contains(msg, "insecure websocket"),
		strings.Contains(msg, "invalid --host"),
		strings.Contains(msg, "invalid subdomain"):
		return false
	default:
		return true
	}
}

func (c *Client) registerError(msg string) error {
	lower := strings.ToLower(msg)
	if c.cfg.Subdomain != "" && strings.Contains(lower, "already in use") {
		return fmt.Errorf("%s — wait for the hold window to expire or use the same network/reclaim token", msg)
	}
	return fmt.Errorf("%s", msg)
}
