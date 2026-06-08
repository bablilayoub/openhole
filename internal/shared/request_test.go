package shared

import "testing"

func TestValidateRequestPath(t *testing.T) {
	tests := []struct {
		path string
		ok   bool
	}{
		{"/api/users", true},
		{"/%2e%2e/secret", true},
		{"http://evil.com/", false},
		{"//evil.com/", false},
		{"../secret", false},
	}

	for _, tc := range tests {
		err := ValidateRequestPath(tc.path)
		if tc.ok && err != nil {
			t.Fatalf("ValidateRequestPath(%q) unexpected error: %v", tc.path, err)
		}
		if !tc.ok && err == nil {
			t.Fatalf("ValidateRequestPath(%q) expected error", tc.path)
		}
	}
}

func TestValidateHTTPMethod(t *testing.T) {
	if err := ValidateHTTPMethod("GET"); err != nil {
		t.Fatal(err)
	}
	if err := ValidateHTTPMethod("TRACE"); err == nil {
		t.Fatal("expected error for TRACE")
	}
}

func TestValidateHost(t *testing.T) {
	if err := ValidateHost("localhost"); err != nil {
		t.Fatal(err)
	}
	if err := ValidateHost("127.0.0.1:3000"); err == nil {
		t.Fatal("expected error for host with port")
	}
}
