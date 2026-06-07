package server

import (
	"net/http"
	"strings"
)

func (s *Server) parseTunnelHost(r *http.Request) (subdomain string, isTunnelEndpoint bool, isTunnelDomain bool) {
	host := hostWithoutPort(r.Host)
	tunnelHost := hostWithoutPort(s.cfg.TunnelEndpointHost)

	if host == tunnelHost || host == "localhost" || host == "127.0.0.1" {
		return "", true, false
	}

	suffix := "." + s.cfg.PublicTunnelDomain
	if host == s.cfg.PublicTunnelDomain {
		return "", false, true
	}
	if !strings.HasSuffix(host, suffix) {
		return "", false, false
	}
	sub := strings.TrimSuffix(host, suffix)
	if sub == "" || strings.Contains(sub, ".") {
		return "", false, true
	}
	if sub == "www" {
		return "", false, true
	}
	return sub, false, true
}

func hostWithoutPort(host string) string {
	if i := strings.LastIndex(host, ":"); i != -1 {
		if strings.Count(host, ":") == 1 {
			return host[:i]
		}
	}
	return host
}
