package server

import (
	"encoding/base64"
	"github.com/bablilayoub/openhole/internal/protocol"
	"github.com/bablilayoub/openhole/internal/shared"
	"github.com/google/uuid"
	"io"
	"net/http"
)

func (s *Server) handlePublicProxy(w http.ResponseWriter, r *http.Request, subdomain string) {
	if err := shared.ValidateHTTPMethod(r.Method); err != nil {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	ip := ClientIP(r, s.cfg.TrustProxyHeaders)
	if ip == "" {
		http.Error(w, "forbidden", http.StatusForbidden)
		return
	}
	if !s.limits.AllowPublicRequest(ip) {
		http.Error(w, "rate limit exceeded", http.StatusTooManyRequests)
		return
	}

	tunnel, ok := s.registry.GetBySubdomain(subdomain)
	if !ok {
		http.Error(w, "tunnel not found", http.StatusNotFound)
		return
	}

	body, err := readBodyLimited(r.Body, s.cfg.MaxBodyBytes)
	if err != nil {
		if err == shared.ErrBodyTooLarge {
			http.Error(w, "payload too large", http.StatusRequestEntityTooLarge)
			return
		}
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	path := requestPath(r)
	if err := shared.ValidateRequestPath(path); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	reqMsg := protocol.RequestMessage{
		Type:       protocol.TypeRequest,
		RequestID:  uuid.NewString(),
		Method:     r.Method,
		Path:       path,
		Query:      r.URL.RawQuery,
		Headers:    shared.SanitizeIncomingHTTPHeaders(r.Header),
		BodyBase64: base64.StdEncoding.EncodeToString(body),
	}

	reqMsg.Headers["X-Forwarded-For"] = []string{ip}
	reqMsg.Headers["X-Forwarded-Host"] = []string{r.Host}
	reqMsg.Headers["X-Forwarded-Proto"] = []string{"https"}
	if s.cfg.PublicURLScheme == "http" {
		reqMsg.Headers["X-Forwarded-Proto"] = []string{"http"}
	}
	reqMsg.Headers["X-OpenHole-Tunnel"] = []string{subdomain}

	resp, err := s.forwardRequest(tunnel, reqMsg)
	if err != nil {
		status := http.StatusBadGateway
		if err == shared.ErrRequestTimeout {
			status = http.StatusGatewayTimeout
		} else if err == shared.ErrTooManyConcurrent {
			status = http.StatusServiceUnavailable
		}
		s.log.Warn("proxy error", "subdomain", subdomain, "path", path, "err", err)
		http.Error(w, http.StatusText(status), status)
		return
	}

	bodyOut, err := base64.StdEncoding.DecodeString(resp.BodyBase64)
	if err != nil {
		http.Error(w, "bad gateway", http.StatusBadGateway)
		return
	}
	if int64(len(bodyOut)) > s.cfg.MaxBodyBytes {
		http.Error(w, "response too large", http.StatusBadGateway)
		return
	}

	status := resp.StatusCode
	if status < 100 || status > 599 {
		status = http.StatusBadGateway
	}

	for k, vals := range shared.SanitizeResponseHeaders(resp.Headers) {
		for _, v := range vals {
			w.Header().Add(k, v)
		}
	}
	w.WriteHeader(status)
	_, _ = w.Write(bodyOut)

	s.log.Info("public request",
		"host", subdomain+"."+s.cfg.PublicTunnelDomain,
		"method", r.Method,
		"path", path,
		"status", status,
	)
}

func requestPath(r *http.Request) string {
	path := r.URL.EscapedPath()
	if path == "" {
		return "/"
	}
	return path
}

func readBodyLimited(r io.Reader, max int64) ([]byte, error) {
	lr := io.LimitReader(r, max+1)
	data, err := io.ReadAll(lr)
	if err != nil {
		return nil, err
	}
	if int64(len(data)) > max {
		return nil, shared.ErrBodyTooLarge
	}
	return data, nil
}
