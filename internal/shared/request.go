package shared

import (
	"net/url"
	"strings"
	"unicode"
)

var allowedMethods = map[string]struct{}{
	"GET":     {},
	"HEAD":    {},
	"POST":    {},
	"PUT":     {},
	"PATCH":   {},
	"DELETE":  {},
	"OPTIONS": {},
}

// ValidateHTTPMethod reports whether a method may be forwarded through the tunnel.
func ValidateHTTPMethod(method string) error {
	if _, ok := allowedMethods[method]; ok {
		return nil
	}
	return ErrInvalidMethod
}

// ValidateRequestPath ensures the path is an origin-form request-target.
func ValidateRequestPath(path string) error {
	if path == "" {
		return nil
	}
	if !strings.HasPrefix(path, "/") {
		return ErrInvalidPath
	}
	if strings.HasPrefix(path, "//") {
		return ErrInvalidPath
	}
	if strings.Contains(path, "://") {
		return ErrInvalidPath
	}
	return rejectTraversalInPath(path)
}

func rejectTraversalInPath(path string) error {
	decoded := path
	for i := 0; i < 3; i++ {
		if hasDotDotSegment(decoded) {
			return ErrInvalidPath
		}
		next, err := url.PathUnescape(decoded)
		if err != nil {
			return ErrInvalidPath
		}
		if next == decoded {
			break
		}
		decoded = next
	}
	if hasDotDotSegment(decoded) {
		return ErrInvalidPath
	}
	return nil
}

func hasDotDotSegment(path string) bool {
	for _, seg := range strings.Split(path, "/") {
		if seg == ".." {
			return true
		}
	}
	return false
}

// ValidateHost rejects host strings that embed a port or look like URLs.
func ValidateHost(host string) error {
	if host == "" {
		return ErrInvalidHost
	}
	if strings.Contains(host, ":") {
		return ErrInvalidHost
	}
	if strings.Contains(host, "://") || strings.Contains(host, "/") {
		return ErrInvalidHost
	}
	return nil
}

// SafeLogField strips control characters from values written to the terminal.
func SafeLogField(s string) string {
	return strings.Map(func(r rune) rune {
		if r == '\t' || r == ' ' || !unicode.IsControl(r) {
			return r
		}
		return -1
	}, s)
}
