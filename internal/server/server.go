package server

import (
	"encoding/json"
	"log/slog"
	"net/http"
)

type Server struct {
	cfg      Config
	log      *slog.Logger
	registry *Registry
	limits   *Limits
}

func New(cfg Config, log *slog.Logger) *Server {
	return &Server{
		cfg:      cfg,
		log:      log,
		registry: NewRegistry(cfg.SubdomainHoldSeconds),
		limits:   NewLimits(cfg),
	}
}

func (s *Server) Handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/", s.handleRequest)
	return mux
}

func (s *Server) handleRequest(w http.ResponseWriter, r *http.Request) {
	subdomain, isTunnelEndpoint, isTunnelDomain := s.parseTunnelHost(r)

	if r.URL.Path == "/health" {
		if !isTunnelEndpoint {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
		return
	}

	if isTunnelEndpoint {
		if r.URL.Path == "/tunnel" {
			s.handleTunnel(w, r)
			return
		}
		http.NotFound(w, r)
		return
	}

	if isTunnelDomain {
		if subdomain == "" {
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}
		s.handlePublicProxy(w, r, subdomain)
		return
	}

	http.NotFound(w, r)
}
