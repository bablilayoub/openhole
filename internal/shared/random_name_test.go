package shared

import (
	"strings"
	"testing"
)

func TestRandomSubdomainFormat(t *testing.T) {
	for i := 0; i < 20; i++ {
		name := RandomSubdomain()
		parts := strings.Split(name, "-")
		if len(parts) != 3 {
			t.Fatalf("expected 3 hyphen-separated parts, got %q", name)
		}
		if err := ValidateSubdomain(name); err != nil {
			t.Fatalf("generated subdomain %q failed validation: %v", name, err)
		}
	}
}

func TestRandomSubdomainUniqueness(t *testing.T) {
	seen := make(map[string]struct{})
	for i := 0; i < 50; i++ {
		name := RandomSubdomain()
		if _, ok := seen[name]; ok {
			continue
		}
		seen[name] = struct{}{}
	}
	if len(seen) < 40 {
		t.Fatalf("expected high uniqueness, got %d unique of 50", len(seen))
	}
}
