package shared

import (
	"net/http"
	"strings"
)

var hopByHop = map[string]struct{}{
	"connection": {}, "keep-alive": {}, "proxy-authenticate": {},
	"proxy-authorization": {}, "te": {}, "trailer": {},
	"transfer-encoding": {}, "upgrade": {},
}

var stripForwarded = map[string]struct{}{
	"x-forwarded-for":        {},
	"x-forwarded-host":       {},
	"x-forwarded-proto":      {},
	"x-forwarded-port":       {},
	"x-forwarded-ssl":        {},
	"x-real-ip":              {},
	"forwarded":              {},
	"cf-connecting-ip":       {},
	"true-client-ip":         {},
	"x-client-ip":            {},
	"x-cluster-client-ip":    {},
	"fastly-client-ip":       {},
	"x-original-url":         {},
	"x-rewrite-url":          {},
	"x-http-method-override": {},
	"content-length":         {},
}

func SanitizeIncomingHTTPHeaders(h http.Header) map[string][]string {
	out := make(map[string][]string)
	for k, vals := range h {
		if shouldStripHeader(k) {
			continue
		}
		cp := filterHeaderValues(k, vals)
		if len(cp) > 0 {
			out[http.CanonicalHeaderKey(k)] = cp
		}
	}
	return out
}

func SanitizeIncomingHeaderMap(h map[string][]string) map[string][]string {
	out := make(map[string][]string)
	for k, vals := range h {
		if shouldStripHeader(k) {
			continue
		}
		cp := filterHeaderValues(k, vals)
		if len(cp) > 0 {
			out[k] = cp
		}
	}
	return out
}

func SanitizeResponseHeaders(h map[string][]string) map[string][]string {
	out := make(map[string][]string)
	for k, vals := range h {
		if isHopByHop(k) {
			continue
		}
		if isDangerousResponseHeader(k) {
			continue
		}
		cp := filterHeaderValues(k, vals)
		if len(cp) > 0 {
			out[k] = cp
		}
	}
	return out
}

func shouldStripHeader(k string) bool {
	return isHopByHop(k) || isForwarded(k)
}

func isHopByHop(k string) bool {
	_, ok := hopByHop[headerLower(k)]
	return ok
}

func isForwarded(k string) bool {
	_, ok := stripForwarded[headerLower(k)]
	return ok
}

func isDangerousResponseHeader(k string) bool {
	switch headerLower(k) {
	case "content-length", "transfer-encoding":
		return true
	default:
		return false
	}
}

func filterHeaderValues(name string, vals []string) []string {
	if !validHeaderName(name) {
		return nil
	}
	cp := make([]string, 0, len(vals))
	for _, v := range vals {
		if validHeaderValue(v) {
			cp = append(cp, v)
		}
	}
	return cp
}

func validHeaderName(name string) bool {
	if name == "" {
		return false
	}
	for i := 0; i < len(name); i++ {
		c := name[i]
		if (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c == '-' {
			continue
		}
		return false
	}
	return true
}

func validHeaderValue(v string) bool {
	return !strings.ContainsAny(v, "\r\n\x00")
}

func headerLower(s string) string {
	b := []byte(s)
	for i := range b {
		if b[i] >= 'A' && b[i] <= 'Z' {
			b[i] += 'a' - 'A'
		}
	}
	return string(b)
}
