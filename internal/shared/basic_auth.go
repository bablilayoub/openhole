package shared

import (
	"crypto/sha256"
	"crypto/subtle"
	"fmt"
	"net/http"
	"strings"
)

// BasicAuth holds hashed credentials for a tunnel's public URL. The plaintext
// is only ever seen while parsing the register message.
type BasicAuth struct {
	userHash [sha256.Size]byte
	passHash [sha256.Size]byte
}

// ParseBasicAuthCredentials parses "user:pass". The password may contain colons.
func ParseBasicAuthCredentials(raw string) (user, pass string, err error) {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return "", "", fmt.Errorf("empty basic auth")
	}
	user, pass, ok := strings.Cut(raw, ":")
	if !ok || user == "" || pass == "" {
		return "", "", fmt.Errorf("basic auth must be user:pass")
	}
	if strings.ContainsAny(user, "\r\n\x00") || strings.ContainsAny(pass, "\r\n\x00") {
		return "", "", fmt.Errorf("invalid basic auth credentials")
	}
	return user, pass, nil
}

// NewBasicAuth hashes the credentials for later comparison.
func NewBasicAuth(user, pass string) *BasicAuth {
	return &BasicAuth{
		userHash: sha256.Sum256([]byte(user)),
		passHash: sha256.Sum256([]byte(pass)),
	}
}

// Match reports whether r carries matching Basic credentials. A nil receiver
// means the tunnel is open. Parsing goes through net/http, so the scheme is
// case-insensitive and spacing is tolerated; comparison is constant-time over
// fixed-size hashes so neither the length nor a matching prefix leaks.
func (a *BasicAuth) Match(r *http.Request) bool {
	if a == nil {
		return true
	}
	user, pass, ok := r.BasicAuth()
	if !ok {
		return false
	}
	uh := sha256.Sum256([]byte(user))
	ph := sha256.Sum256([]byte(pass))
	userOK := subtle.ConstantTimeCompare(uh[:], a.userHash[:])
	passOK := subtle.ConstantTimeCompare(ph[:], a.passHash[:])
	return userOK&passOK == 1
}

// RequireBasicAuth writes a 401 challenge.
func RequireBasicAuth(w http.ResponseWriter) {
	w.Header().Set("WWW-Authenticate", `Basic realm="OpenHole"`)
	http.Error(w, "unauthorized", http.StatusUnauthorized)
}

// StripAuthorization removes Authorization from a header map (case-insensitive key).
func StripAuthorization(headers map[string][]string) {
	for k := range headers {
		if strings.EqualFold(k, "Authorization") {
			delete(headers, k)
		}
	}
}
