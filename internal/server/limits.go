package server

import (
	"net"
	"net/http"
	"strings"
	"sync"
	"time"
)

type Limits struct {
	cfg Config

	regMu    sync.Mutex
	regTimes map[string][]time.Time

	pubMu    sync.Mutex
	pubTimes map[string][]time.Time
}

func NewLimits(cfg Config) *Limits {
	return &Limits{
		cfg:      cfg,
		regTimes: make(map[string][]time.Time),
		pubTimes: make(map[string][]time.Time),
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
		return false
	}
	filtered = append(filtered, now)
	store[key] = filtered
	return true
}

func ClientIP(r *http.Request, trustProxy bool) string {
	if trustProxy {
		if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
			parts := strings.Split(xff, ",")
			return strings.TrimSpace(parts[0])
		}
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}
