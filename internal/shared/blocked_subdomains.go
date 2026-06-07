package shared

import (
	"strings"
	"sync"
)

var blockedSubdomains = map[string]struct{}{
	// Infrastructure & system
	"www": {}, "api": {}, "app": {}, "docs": {}, "status": {}, "tunnel": {},
	"admin": {}, "mail": {}, "smtp": {}, "imap": {}, "pop": {}, "ftp": {},
	"sftp": {}, "ssh": {}, "localhost": {}, "root": {}, "support": {},
	"help": {}, "blog": {}, "cdn": {}, "assets": {}, "static": {},
	"ns1": {}, "ns2": {}, "dns": {}, "mx": {}, "web": {}, "portal": {},
	"dashboard": {}, "panel": {}, "cpanel": {}, "internal": {}, "private": {},
	"staging": {}, "prod": {}, "production": {}, "dev": {}, "test": {},
	"demo": {}, "beta": {}, "alpha": {},
	// Phishing & brand impersonation
	"login": {}, "signin": {}, "sign-in": {}, "signup": {}, "sign-up": {},
	"auth": {}, "authenticate": {}, "account": {}, "accounts": {},
	"secure": {}, "security": {}, "verify": {}, "verification": {},
	"update": {}, "billing": {}, "payment": {}, "pay": {}, "wallet": {},
	"bank": {}, "banking": {}, "paypal": {}, "stripe": {}, "venmo": {},
	"cashapp": {}, "apple": {}, "google": {}, "gmail": {}, "microsoft": {},
	"outlook": {}, "office365": {}, "o365": {}, "amazon": {}, "aws": {},
	"facebook": {}, "meta": {}, "instagram": {}, "twitter": {}, "x": {},
	"netflix": {}, "spotify": {}, "discord": {}, "telegram": {}, "whatsapp": {},
	"chase": {}, "wellsfargo": {}, "bankofamerica": {}, "citibank": {},
	"coinbase": {}, "binance": {}, "kraken": {}, "crypto": {}, "blockchain": {},
	"oauth": {}, "password": {}, "reset": {}, "confirm": {}, "identity": {},
	"myaccount": {}, "webmail": {}, "admin-panel": {}, "phpmyadmin": {},
	"wordpress": {}, "database": {}, "db": {}, "mysql": {}, "postgres": {},
	"redis": {}, "mongo": {}, "elasticsearch": {}, "grafana": {}, "prometheus": {},
	"openhole": {}, "ophl": {}, "ngrok": {},
}

var (
	extraMu      sync.RWMutex
	extraBlocked map[string]struct{}
)

func InitBlockedSubdomains(extra []string) {
	extraMu.Lock()
	defer extraMu.Unlock()
	extraBlocked = make(map[string]struct{})
	for _, s := range extra {
		s = strings.ToLower(strings.TrimSpace(s))
		if s != "" {
			extraBlocked[s] = struct{}{}
		}
	}
}

func IsBlockedSubdomain(name string) bool {
	name = strings.ToLower(strings.TrimSpace(name))
	if name == "" {
		return true
	}
	if _, ok := blockedSubdomains[name]; ok {
		return true
	}
	extraMu.RLock()
	defer extraMu.RUnlock()
	_, ok := extraBlocked[name]
	return ok
}
