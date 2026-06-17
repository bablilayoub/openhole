package server

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/bablilayoub/openhole/internal/protocol"
	"github.com/bablilayoub/openhole/internal/shared"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	// CLI clients do not send Origin; block browser-driven WebSocket registration.
	CheckOrigin: func(r *http.Request) bool {
		return r.Header.Get("Origin") == ""
	},
}

func (s *Server) handleTunnel(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	ip := ClientIP(r, s.cfg.TrustProxyHeaders)
	if ip == "" {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}
	if s.limits.IsIPBlocked(ip) {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}
	if !s.limits.BeginTunnelUpgrade(ip) {
		http.Error(w, "rate limit exceeded", http.StatusTooManyRequests)
		return
	}
	defer s.limits.EndTunnelUpgrade(ip)

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		s.log.Error("websocket upgrade failed", "err", err)
		return
	}
	conn.SetReadLimit(protocol.MaxMessageSize)
	_ = conn.SetReadDeadline(time.Now().Add(10 * time.Second))

	env, raw, err := protocol.ReadMessage(conn)
	if err != nil || env.Type != protocol.TypeRegister {
		_ = protocol.WriteMessage(conn, protocol.ErrorMessage{
			Type:    protocol.TypeError,
			Message: "first message must be register",
		})
		conn.Close()
		return
	}

	reg, err := protocol.ParseRegister(raw)
	if err != nil {
		_ = protocol.WriteMessage(conn, protocol.ErrorMessage{
			Type:    protocol.TypeError,
			Message: "invalid register message",
		})
		conn.Close()
		return
	}

	if reg.LocalPort < 1 || reg.LocalPort > 65535 {
		_ = protocol.WriteMessage(conn, protocol.ErrorMessage{
			Type:    protocol.TypeError,
			Message: "invalid local_port",
		})
		conn.Close()
		return
	}

	if !s.cfg.registrationTokenValid(reg.AuthToken) {
		_ = protocol.WriteMessage(conn, protocol.ErrorMessage{
			Type:    protocol.TypeError,
			Message: "invalid or missing registration token",
		})
		conn.Close()
		return
	}

	subdomain, err := s.registry.AssignSubdomain(reg.RequestedSubdomain, ip, reg.ReclaimToken)
	if err != nil {
		msg := err.Error()
		if err == shared.ErrSubdomainTaken {
			msg = fmt.Sprintf("subdomain %q is already in use", reg.RequestedSubdomain)
		} else if err == shared.ErrSubdomainBlocked {
			msg = fmt.Sprintf("subdomain %q is not allowed", reg.RequestedSubdomain)
		}
		_ = protocol.WriteMessage(conn, protocol.ErrorMessage{Type: protocol.TypeError, Message: msg})
		conn.Close()
		return
	}

	tunnel := &Tunnel{
		ID:        uuid.NewString(),
		Subdomain: subdomain,
		Conn:      conn,
		ClientIP:  ip,
		CreatedAt: time.Now(),
		Pending:   make(map[string]chan tunnelResponse),
		sem:       make(chan struct{}, s.cfg.MaxConcurrentRequestsPerTunnel),
	}

	named := strings.TrimSpace(reg.RequestedSubdomain) != ""
	if err := s.registry.RegisterWithIPLimit(tunnel, s.cfg.MaxTunnelsPerIP, reg.ReclaimToken); err != nil {
		_ = protocol.WriteMessage(conn, protocol.ErrorMessage{Type: protocol.TypeError, Message: err.Error()})
		conn.Close()
		return
	}

	publicURL := s.cfg.PublicURL(subdomain)
	reclaimToken := s.registry.IssueReclaimToken(tunnel, named)
	_ = conn.SetReadDeadline(time.Time{})

	_ = tunnel.WriteMessage(protocol.RegisteredMessage{
		Type:         protocol.TypeRegistered,
		TunnelID:     tunnel.ID,
		Subdomain:    subdomain,
		PublicURL:    publicURL,
		ReclaimToken: reclaimToken,
	})

	s.log.Info("tunnel registered", "subdomain", subdomain, "ip", ip)

	go s.tunnelReadLoop(tunnel)
	go s.tunnelPingLoop(tunnel)
}

func (s *Server) tunnelReadLoop(tunnel *Tunnel) {
	defer func() {
		s.registry.Unregister(tunnel.Subdomain)
		tunnel.Conn.Close()
		s.log.Info("tunnel disconnected", "subdomain", tunnel.Subdomain)
	}()

	for {
		msg, err := protocol.ReadTunnelMessage(tunnel.Conn)
		if err != nil {
			return
		}
		if msg.WSFrame != nil {
			s.dispatchWSFrame(tunnel, msg.WSFrame)
			continue
		}
		env, raw := msg.JSON, msg.RawJSON
		switch env.Type {
		case protocol.TypeResponse:
			resp, err := protocol.ParseResponse(raw)
			if err != nil {
				continue
			}
			tunnel.mu.Lock()
			ch, ok := tunnel.Pending[resp.RequestID]
			if ok {
				delete(tunnel.Pending, resp.RequestID)
			}
			tunnel.mu.Unlock()
			if ok {
				select {
				case ch <- tunnelResponse{Msg: resp}:
				default:
				}
				select {
				case <-tunnel.sem:
				default:
				}
			}
		case protocol.TypeError:
			em, err := protocol.ParseError(raw)
			if err != nil {
				continue
			}
			tunnel.mu.Lock()
			ch, ok := tunnel.Pending[em.RequestID]
			if ok {
				delete(tunnel.Pending, em.RequestID)
			}
			tunnel.mu.Unlock()
			if ok {
				select {
				case ch <- tunnelResponse{Err: fmt.Errorf("%s", em.Message)}:
				default:
				}
				select {
				case <-tunnel.sem:
				default:
				}
			}
		case protocol.TypePong:
			// keepalive ack
		case protocol.TypeWSOpenOK:
			okMsg, err := protocol.ParseWSOpenOK(raw)
			if err != nil {
				continue
			}
			s.dispatchWSOpenResult(tunnel, &okMsg)
		case protocol.TypeWSOpenFail:
			failMsg, err := protocol.ParseWSOpenFail(raw)
			if err != nil {
				continue
			}
			s.dispatchWSOpenFail(tunnel, &failMsg)
		default:
			s.log.Warn("unknown message from client", "type", env.Type)
		}
	}
}

func (s *Server) tunnelPingLoop(tunnel *Tunnel) {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()
	for range ticker.C {
		if err := tunnel.WriteMessage(protocol.PingMessage{Type: protocol.TypePing}); err != nil {
			return
		}
	}
}

func (s *Server) forwardRequest(tunnel *Tunnel, req protocol.RequestMessage) (protocol.ResponseMessage, error) {
	select {
	case tunnel.sem <- struct{}{}:
	default:
		return protocol.ResponseMessage{}, shared.ErrTooManyConcurrent
	}

	ch := make(chan tunnelResponse, 1)
	tunnel.mu.Lock()
	tunnel.Pending[req.RequestID] = ch
	tunnel.mu.Unlock()

	if err := tunnel.WriteMessage(req); err != nil {
		tunnel.mu.Lock()
		delete(tunnel.Pending, req.RequestID)
		tunnel.mu.Unlock()
		<-tunnel.sem
		return protocol.ResponseMessage{}, err
	}

	timeout := time.Duration(s.cfg.RequestTimeoutSeconds) * time.Second
	timer := time.NewTimer(timeout)
	defer timer.Stop()

	select {
	case res := <-ch:
		if !timer.Stop() {
			<-timer.C
		}
		if res.Err != nil {
			return protocol.ResponseMessage{}, res.Err
		}
		return res.Msg, nil
	case <-timer.C:
		tunnel.mu.Lock()
		delete(tunnel.Pending, req.RequestID)
		tunnel.mu.Unlock()
		<-tunnel.sem
		return protocol.ResponseMessage{}, shared.ErrRequestTimeout
	}
}
