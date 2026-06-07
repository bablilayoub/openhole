package shared

import (
	"regexp"
	"strings"
)

var subdomainRegex = regexp.MustCompile(`^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$`)

func ValidateSubdomain(name string) error {
	name = strings.ToLower(strings.TrimSpace(name))
	if !subdomainRegex.MatchString(name) {
		return ErrSubdomainInvalid
	}
	if IsBlockedSubdomain(name) {
		return ErrSubdomainBlocked
	}
	return nil
}
