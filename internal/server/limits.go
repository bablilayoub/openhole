package server

import (
	"net"
	"net/http"
	"strings"
	"sync"
	"time"
)

const (
	maxRateLimitKeys        = 8192
	maxPendingUpgradesPerIP = 3
)

type Limits struct {
	cfg Config

	regMu    sync.Mutex
	regTimes map[string][]time.Time

	pubMu    sync.Mutex
	pubTimes map[string][]time.Time

	upgradeMu       sync.Mutex
	pendingUpgrades map[string]int
}

func NewLimits(cfg Config) *Limits {
	return &Limits{
		cfg:             cfg,
		regTimes:        make(map[string][]time.Time),
		pubTimes:        make(map[string][]time.Time),
		pendingUpgrades: make(map[string]int),
	}
}

func (l *Limits) IsIPBlocked(ip string) bool {
	_, ok := l.cfg.BlockedIPs[ip]
	return ok
}

func (l *Limits) AllowRegistrationRate(ip string) bool {
	if l.IsIPBlocked(ip) {
		return false
	}
	return l.checkRate(&l.regMu, l.regTimes, ip, l.cfg.MaxRegistrationsPerIPPerMinute, time.Minute)
}

func (l *Limits) AllowPublicRequest(ip string) bool {
	if l.IsIPBlocked(ip) {
		return false
	}
	return l.checkRate(&l.pubMu, l.pubTimes, ip, l.cfg.MaxPublicRequestsPerIPPerMinute, time.Minute)
}

// BeginTunnelUpgrade applies registration rate limits and caps half-open WebSocket handshakes per IP.
func (l *Limits) BeginTunnelUpgrade(ip string) bool {
	if !l.AllowRegistrationRate(ip) {
		return false
	}
	l.upgradeMu.Lock()
	defer l.upgradeMu.Unlock()
	if l.pendingUpgrades[ip] >= maxPendingUpgradesPerIP {
		return false
	}
	l.pendingUpgrades[ip]++
	return true
}

func (l *Limits) EndTunnelUpgrade(ip string) {
	l.upgradeMu.Lock()
	defer l.upgradeMu.Unlock()
	if l.pendingUpgrades[ip] <= 1 {
		delete(l.pendingUpgrades, ip)
		return
	}
	l.pendingUpgrades[ip]--
}

func (l *Limits) checkRate(mu *sync.Mutex, store map[string][]time.Time, key string, max int, window time.Duration) bool {
	mu.Lock()
	defer mu.Unlock()
	now := time.Now()
	cutoff := now.Add(-window)
	times := store[key]
	filtered := times[:0]
	for _, t := range times {
		if t.After(cutoff) {
			filtered = append(filtered, t)
		}
	}
	if len(filtered) >= max {
		if len(filtered) == 0 {
			delete(store, key)
		} else {
			store[key] = filtered
		}
		l.pruneRateStore(store, cutoff)
		return false
	}
	filtered = append(filtered, now)
	store[key] = filtered
	l.pruneRateStore(store, cutoff)
	return true
}

func (l *Limits) pruneRateStore(store map[string][]time.Time, cutoff time.Time) {
	if len(store) <= maxRateLimitKeys {
		return
	}
	for key, times := range store {
		filtered := times[:0]
		for _, t := range times {
			if t.After(cutoff) {
				filtered = append(filtered, t)
			}
		}
		if len(filtered) == 0 {
			delete(store, key)
		} else {
			store[key] = filtered
		}
		if len(store) <= maxRateLimitKeys {
			return
		}
	}
}

func ClientIP(r *http.Request, trustProxy bool) string {
	if trustProxy {
		if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
			parts := strings.Split(xff, ",")
			if ip := parseClientIP(strings.TrimSpace(parts[0])); ip != "" {
				return ip
			}
		}
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		if ip := parseClientIP(r.RemoteAddr); ip != "" {
			return ip
		}
		return r.RemoteAddr
	}
	if ip := parseClientIP(host); ip != "" {
		return ip
	}
	return host
}

func parseClientIP(raw string) string {
	ip := net.ParseIP(strings.TrimSpace(raw))
	if ip == nil {
		return ""
	}
	return ip.String()
}
