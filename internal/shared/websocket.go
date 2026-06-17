package shared

import (
	"net/http"
	"strings"
)

// IsWebSocketUpgrade reports whether r is an HTTP WebSocket upgrade request.
func IsWebSocketUpgrade(r *http.Request) bool {
	if !strings.EqualFold(r.Header.Get("Upgrade"), "websocket") {
		return false
	}
	return headerTokenContains(r.Header.Get("Connection"), "upgrade")
}

func headerTokenContains(h, token string) bool {
	for _, part := range strings.Split(h, ",") {
		if strings.EqualFold(strings.TrimSpace(part), token) {
			return true
		}
	}
	return false
}

var wsHandshakeHeaderNames = []string{
	"Connection",
	"Upgrade",
	"Sec-Websocket-Key",
	"Sec-Websocket-Version",
	"Sec-Websocket-Protocol",
	"Sec-Websocket-Extensions",
	"Origin",
}

// WebSocketHandshakeHeaders copies handshake headers needed to replay an upgrade.
func WebSocketHandshakeHeaders(h http.Header) map[string][]string {
	out := make(map[string][]string)
	for _, name := range wsHandshakeHeaderNames {
		vals := h.Values(name)
		if len(vals) == 0 {
			continue
		}
		cp := make([]string, len(vals))
		copy(cp, vals)
		out[http.CanonicalHeaderKey(name)] = cp
	}
	return out
}

// WebSocketResponseHeaders copies 101 Switching Protocols response headers.
func WebSocketResponseHeaders(h http.Header) map[string][]string {
	out := make(map[string][]string)
	for _, name := range []string{
		"Connection",
		"Upgrade",
		"Sec-Websocket-Accept",
		"Sec-Websocket-Protocol",
		"Sec-Websocket-Extensions",
	} {
		vals := h.Values(name)
		if len(vals) == 0 {
			continue
		}
		cp := make([]string, len(vals))
		copy(cp, vals)
		out[http.CanonicalHeaderKey(name)] = cp
	}
	return out
}
