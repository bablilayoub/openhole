package shared

import "errors"

var (
	ErrSubdomainTaken    = errors.New("subdomain is already in use")
	ErrSubdomainBlocked  = errors.New("subdomain is not allowed")
	ErrSubdomainInvalid  = errors.New("subdomain format is invalid")
	ErrTunnelNotFound    = errors.New("tunnel not found")
	ErrRateLimited       = errors.New("rate limit exceeded")
	ErrIPBlocked         = errors.New("ip is blocked")
	ErrBodyTooLarge      = errors.New("body exceeds size limit")
	ErrRequestTimeout    = errors.New("request timed out")
	ErrTooManyConcurrent = errors.New("too many concurrent requests")
	ErrInvalidMethod     = errors.New("invalid http method")
	ErrInvalidPath       = errors.New("invalid request path")
	ErrInvalidHost       = errors.New("invalid host")
)
