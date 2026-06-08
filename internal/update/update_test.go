package update

import "testing"

func TestCompareVersions(t *testing.T) {
	tests := []struct {
		current string
		latest  string
		want    int
	}{
		{"0.1.1", "0.1.2", -1},
		{"0.1.2", "0.1.2", 0},
		{"0.2.0", "0.1.9", 1},
		{"v0.1.1", "0.1.2", -1},
		{"0.1.10", "0.1.9", 1},
	}

	for _, tc := range tests {
		if got := CompareVersions(tc.current, tc.latest); got != tc.want {
			t.Fatalf("CompareVersions(%q, %q) = %d, want %d", tc.current, tc.latest, got, tc.want)
		}
	}
}

func TestNormalizeVersion(t *testing.T) {
	if got := normalizeVersion("v0.1.2"); got != "0.1.2" {
		t.Fatalf("normalizeVersion() = %q", got)
	}
}
