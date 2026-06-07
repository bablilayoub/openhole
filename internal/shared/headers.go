package shared

import "net/http"

var hopByHop = map[string]struct{}{
	"connection": {}, "keep-alive": {}, "proxy-authenticate": {},
	"proxy-authorization": {}, "te": {}, "trailer": {},
	"transfer-encoding": {}, "upgrade": {},
}

var stripForwarded = map[string]struct{}{
	"x-forwarded-for": {}, "x-forwarded-host": {}, "x-forwarded-proto": {},
	"x-forwarded-port": {}, "x-real-ip": {}, "forwarded": {},
}

func SanitizeIncomingHTTPHeaders(h http.Header) map[string][]string {
	out := make(map[string][]string)
	for k, vals := range h {
		kl := http.CanonicalHeaderKey(k)
		if shouldStripHeader(k) {
			continue
		}
		cp := make([]string, len(vals))
		copy(cp, vals)
		out[kl] = cp
	}
	return out
}

func SanitizeIncomingHeaderMap(h map[string][]string) map[string][]string {
	out := make(map[string][]string)
	for k, vals := range h {
		if shouldStripHeader(k) {
			continue
		}
		cp := make([]string, len(vals))
		copy(cp, vals)
		out[k] = cp
	}
	return out
}

func SanitizeResponseHeaders(h map[string][]string) map[string][]string {
	out := make(map[string][]string)
	for k, vals := range h {
		if isHopByHop(k) {
			continue
		}
		cp := make([]string, len(vals))
		copy(cp, vals)
		out[k] = cp
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

func headerLower(s string) string {
	b := []byte(s)
	for i := range b {
		if b[i] >= 'A' && b[i] <= 'Z' {
			b[i] += 'a' - 'A'
		}
	}
	return string(b)
}
