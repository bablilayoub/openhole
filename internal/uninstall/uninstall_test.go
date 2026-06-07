package uninstall

import (
	"os"
	"path/filepath"
	"testing"
)

func TestDedupe(t *testing.T) {
	got := dedupe([]string{"/a/b", "/a/b", "", "/c", "/c"})
	want := []string{"/a/b", "/c"}
	if len(got) != len(want) {
		t.Fatalf("dedupe() = %v, want %v", got, want)
	}
	for i := range want {
		if got[i] != want[i] {
			t.Fatalf("dedupe()[%d] = %q, want %q", i, got[i], want[i])
		}
	}
}

func TestCandidatesIncludesInstallDir(t *testing.T) {
	dir := t.TempDir()
	paths := Candidates(dir)
	want := filepath.Join(dir, binaryName)
	for _, p := range paths {
		if p == want {
			return
		}
	}
	t.Fatalf("Candidates(%q) = %v, missing %q", dir, paths, want)
}

func TestRemoveBinary(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, binaryName)
	if err := os.WriteFile(path, []byte("bin"), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := removeBinary(path); err != nil {
		t.Fatal(err)
	}
	if _, err := os.Stat(path); !os.IsNotExist(err) {
		t.Fatalf("expected removed file, stat err = %v", err)
	}
}
