package server

import (
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/bablilayoub/openhole/internal/protocol"
	"github.com/bablilayoub/openhole/internal/shared"
	"github.com/gorilla/websocket"
)

type Tunnel struct {
	ID               string
	Subdomain        string
	Conn             *websocket.Conn
	ClientIP         string
	ReclaimTokenHash string
	CreatedAt        time.Time
	Pending          map[string]chan tunnelResponse
	mu               sync.Mutex
	writeMu          sync.Mutex
	sem              chan struct{}
}

type tunnelResponse struct {
	Msg protocol.ResponseMessage
	Err error
}

type holdEntry struct {
	until     time.Time
	clientIP  string
	tokenHash string
}

type Registry struct {
	mu      sync.RWMutex
	tunnels map[string]*Tunnel
	holds   map[string]holdEntry
	holdDur time.Duration
}

func NewRegistry(holdSeconds int) *Registry {
	return &Registry{
		tunnels: make(map[string]*Tunnel),
		holds:   make(map[string]holdEntry),
		holdDur: time.Duration(holdSeconds) * time.Second,
	}
}

func (t *Tunnel) WriteMessage(v any) error {
	t.writeMu.Lock()
	defer t.writeMu.Unlock()
	return protocol.WriteMessage(t.Conn, v)
}

func (r *Registry) Register(t *Tunnel) error {
	return r.register(t, 0, "")
}

func (r *Registry) RegisterWithIPLimit(t *Tunnel, maxPerIP int, reclaimToken string) error {
	return r.register(t, maxPerIP, reclaimToken)
}

func (r *Registry) register(t *Tunnel, maxPerIP int, reclaimToken string) error {
	if err := shared.ValidateSubdomain(t.Subdomain); err != nil {
		return err
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	r.cleanupHoldsLocked()

	if maxPerIP > 0 {
		n := 0
		for _, existing := range r.tunnels {
			if existing.ClientIP == t.ClientIP {
				n++
			}
		}
		if n >= maxPerIP {
			return fmt.Errorf("too many tunnels from this IP")
		}
	}

	if _, ok := r.tunnels[t.Subdomain]; ok {
		return shared.ErrSubdomainTaken
	}
	if hold, ok := r.holds[t.Subdomain]; ok && time.Now().Before(hold.until) {
		if !canReclaimHold(hold, t.ClientIP, reclaimToken) {
			return shared.ErrSubdomainTaken
		}
	}
	delete(r.holds, t.Subdomain)
	r.tunnels[t.Subdomain] = t
	return nil
}

// IssueReclaimToken creates a reclaim token for named subdomains.
func (r *Registry) IssueReclaimToken(t *Tunnel, named bool) string {
	if !named {
		return ""
	}
	plain, hash, err := newReclaimToken()
	if err != nil {
		return ""
	}
	t.ReclaimTokenHash = hash
	return plain
}

func (r *Registry) Unregister(subdomain string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	var clientIP, tokenHash string
	if t, ok := r.tunnels[subdomain]; ok {
		clientIP = t.ClientIP
		tokenHash = t.ReclaimTokenHash
		t.closeAllPending(fmt.Errorf("tunnel disconnected"))
	}
	delete(r.tunnels, subdomain)
	if clientIP != "" {
		r.holds[subdomain] = holdEntry{
			until:     time.Now().Add(r.holdDur),
			clientIP:  clientIP,
			tokenHash: tokenHash,
		}
	}
}

func (t *Tunnel) closeAllPending(err error) {
	t.mu.Lock()
	defer t.mu.Unlock()
	for id, ch := range t.Pending {
		select {
		case ch <- tunnelResponse{Err: err}:
		default:
		}
		delete(t.Pending, id)
		select {
		case <-t.sem:
		default:
		}
	}
}

func (r *Registry) GetBySubdomain(subdomain string) (*Tunnel, bool) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	t, ok := r.tunnels[subdomain]
	return t, ok
}

func (r *Registry) IsAvailable(subdomain string) bool {
	return r.IsAvailableFor(subdomain, "", "")
}

func (r *Registry) IsAvailableFor(subdomain, clientIP, reclaimToken string) bool {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.cleanupHoldsLocked()
	if _, ok := r.tunnels[subdomain]; ok {
		return false
	}
	if hold, ok := r.holds[subdomain]; ok && time.Now().Before(hold.until) {
		if !canReclaimHold(hold, clientIP, reclaimToken) {
			return false
		}
	}
	return shared.ValidateSubdomain(subdomain) == nil
}

func (r *Registry) CleanupExpiredHolds() {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.cleanupHoldsLocked()
}

func (r *Registry) cleanupHoldsLocked() {
	now := time.Now()
	for k, v := range r.holds {
		if now.After(v.until) {
			delete(r.holds, k)
		}
	}
}

func (r *Registry) AssignSubdomain(requested, clientIP, reclaimToken string) (string, error) {
	requested = strings.ToLower(strings.TrimSpace(requested))
	if requested != "" {
		if err := shared.ValidateSubdomain(requested); err != nil {
			return "", err
		}
		if !r.IsAvailableFor(requested, clientIP, reclaimToken) {
			return "", shared.ErrSubdomainTaken
		}
		return requested, nil
	}
	for i := 0; i < 10; i++ {
		name := shared.RandomSubdomain()
		if r.IsAvailable(name) {
			return name, nil
		}
	}
	return "", fmt.Errorf("failed to generate available subdomain")
}
