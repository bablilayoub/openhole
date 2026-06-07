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
	ID        string
	Subdomain string
	Conn      *websocket.Conn
	ClientIP  string
	CreatedAt time.Time
	LocalHost string
	LocalPort int
	Pending   map[string]chan tunnelResponse
	mu        sync.Mutex
	sem       chan struct{}
}

type tunnelResponse struct {
	Msg protocol.ResponseMessage
	Err error
}

type Registry struct {
	mu      sync.RWMutex
	tunnels map[string]*Tunnel
	holds   map[string]time.Time
	holdDur time.Duration
}

func NewRegistry(holdSeconds int) *Registry {
	return &Registry{
		tunnels: make(map[string]*Tunnel),
		holds:   make(map[string]time.Time),
		holdDur: time.Duration(holdSeconds) * time.Second,
	}
}

func (r *Registry) Register(t *Tunnel) error {
	if err := shared.ValidateSubdomain(t.Subdomain); err != nil {
		return err
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	r.cleanupHoldsLocked()
	if _, ok := r.tunnels[t.Subdomain]; ok {
		return shared.ErrSubdomainTaken
	}
	if hold, ok := r.holds[t.Subdomain]; ok && time.Now().Before(hold) {
		return shared.ErrSubdomainTaken
	}
	delete(r.holds, t.Subdomain)
	r.tunnels[t.Subdomain] = t
	return nil
}

func (r *Registry) Unregister(subdomain string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	if t, ok := r.tunnels[subdomain]; ok {
		t.closeAllPending(fmt.Errorf("tunnel disconnected"))
	}
	delete(r.tunnels, subdomain)
	r.holds[subdomain] = time.Now().Add(r.holdDur)
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
	}
}

func (r *Registry) GetBySubdomain(subdomain string) (*Tunnel, bool) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	t, ok := r.tunnels[subdomain]
	return t, ok
}

func (r *Registry) IsAvailable(subdomain string) bool {
	r.mu.RLock()
	defer r.mu.RUnlock()
	r.cleanupHoldsLocked()
	if _, ok := r.tunnels[subdomain]; ok {
		return false
	}
	if hold, ok := r.holds[subdomain]; ok && time.Now().Before(hold) {
		return false
	}
	return shared.ValidateSubdomain(subdomain) == nil
}

func (r *Registry) CountByIP(ip string) int {
	r.mu.RLock()
	defer r.mu.RUnlock()
	n := 0
	for _, t := range r.tunnels {
		if t.ClientIP == ip {
			n++
		}
	}
	return n
}

func (r *Registry) CleanupExpiredHolds() {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.cleanupHoldsLocked()
}

func (r *Registry) cleanupHoldsLocked() {
	now := time.Now()
	for k, v := range r.holds {
		if now.After(v) {
			delete(r.holds, k)
		}
	}
}

func (r *Registry) AssignSubdomain(requested string) (string, error) {
	requested = strings.ToLower(strings.TrimSpace(requested))
	if requested != "" {
		if err := shared.ValidateSubdomain(requested); err != nil {
			return "", err
		}
		if !r.IsAvailable(requested) {
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
