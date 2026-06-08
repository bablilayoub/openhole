package server

import (
	"os"
	"strconv"
	"strings"

	"github.com/bablilayoub/openhole/internal/protocol"
	"github.com/bablilayoub/openhole/internal/shared"
)

type Config struct {
	PublicTunnelDomain              string
	TunnelEndpointHost              string
	ServerPort                      string
	MaxBodyBytes                    int64
	RequestTimeoutSeconds           int
	MaxConcurrentRequestsPerTunnel  int
	MaxTunnelsPerIP                 int
	MaxRegistrationsPerIPPerMinute  int
	MaxPublicRequestsPerIPPerMinute int
	SubdomainHoldSeconds            int
	PublicURLScheme                 string
	TrustProxyHeaders               bool
	BlockedIPs                      map[string]struct{}
}

func LoadConfig() Config {
	cfg := Config{
		PublicTunnelDomain:              envOr("PUBLIC_TUNNEL_DOMAIN", "ophl.link"),
		TunnelEndpointHost:              envOr("TUNNEL_ENDPOINT_HOST", "tunnel.openhole.dev"),
		ServerPort:                      envOr("SERVER_PORT", "8080"),
		MaxBodyBytes:                    envInt64("MAX_BODY_BYTES", 10*1024*1024),
		RequestTimeoutSeconds:           envInt("REQUEST_TIMEOUT_SECONDS", 30),
		MaxConcurrentRequestsPerTunnel:  envInt("MAX_CONCURRENT_REQUESTS_PER_TUNNEL", 25),
		MaxTunnelsPerIP:                 envInt("MAX_TUNNELS_PER_IP", 3),
		MaxRegistrationsPerIPPerMinute:  envInt("MAX_REGISTRATIONS_PER_IP_PER_MINUTE", 5),
		MaxPublicRequestsPerIPPerMinute: envInt("MAX_PUBLIC_REQUESTS_PER_IP_PER_MINUTE", 120),
		SubdomainHoldSeconds:            envInt("SUBDOMAIN_HOLD_SECONDS", 30),
		PublicURLScheme:                 envOr("PUBLIC_URL_SCHEME", "https"),
		TrustProxyHeaders:               envOr("TRUST_PROXY_HEADERS", "false") == "true",
		BlockedIPs:                      parseBlockedIPs(os.Getenv("BLOCKED_IPS")),
	}

	extra := strings.Split(os.Getenv("BLOCKED_SUBDOMAINS_EXTRA"), ",")
	shared.InitBlockedSubdomains(extra)

	maxSafeBody := int64(protocol.MaxMessageSize*3/4) - 4096
	if cfg.MaxBodyBytes > maxSafeBody {
		cfg.MaxBodyBytes = maxSafeBody
	}

	return cfg
}

func (c Config) PublicURL(subdomain string) string {
	return c.PublicURLScheme + "://" + subdomain + "." + c.PublicTunnelDomain
}

func envOr(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}

func envInt(key string, def int) int {
	if v := os.Getenv(key); v != "" {
		if n, err := strconv.Atoi(v); err == nil {
			return n
		}
	}
	return def
}

func envInt64(key string, def int64) int64 {
	if v := os.Getenv(key); v != "" {
		if n, err := strconv.ParseInt(v, 10, 64); err == nil {
			return n
		}
	}
	return def
}

func parseBlockedIPs(raw string) map[string]struct{} {
	m := make(map[string]struct{})
	for _, ip := range strings.Split(raw, ",") {
		ip = strings.TrimSpace(ip)
		if ip != "" {
			m[ip] = struct{}{}
		}
	}
	return m
}
