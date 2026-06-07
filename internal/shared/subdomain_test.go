package shared

import "testing"

func TestValidateSubdomain(t *testing.T) {
	tests := []struct {
		name    string
		input   string
		wantErr error
	}{
		{"valid random style", "blue-fox-a3f2", nil},
		{"valid custom", "my-app", nil},
		{"blocked admin", "admin", ErrSubdomainBlocked},
		{"blocked login", "login", ErrSubdomainBlocked},
		{"invalid underscore", "my_app", ErrSubdomainInvalid},
		{"invalid leading hyphen", "-bad", ErrSubdomainInvalid},
		{"invalid trailing hyphen", "bad-", ErrSubdomainInvalid},
		{"empty", "", ErrSubdomainInvalid},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			err := ValidateSubdomain(tc.input)
			if tc.wantErr == nil && err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if tc.wantErr != nil && err != tc.wantErr {
				t.Fatalf("got %v, want %v", err, tc.wantErr)
			}
		})
	}
}

func TestInitBlockedSubdomainsExtra(t *testing.T) {
	InitBlockedSubdomains([]string{" evil ", "custom-block"})
	if err := ValidateSubdomain("evil"); err != ErrSubdomainBlocked {
		t.Fatalf("expected extra blocked subdomain, got %v", err)
	}
	if err := ValidateSubdomain("custom-block"); err != ErrSubdomainBlocked {
		t.Fatalf("expected custom-block blocked, got %v", err)
	}
}
