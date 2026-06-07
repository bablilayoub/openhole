package uninstall

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

const binaryName = "openhole"

// Result describes what was checked and removed.
type Result struct {
	Removed []string
	Checked []string
}

// Candidates returns deduplicated paths where openhole may be installed.
func Candidates(installDir string) []string {
	if installDir == "" {
		installDir = os.Getenv("INSTALL_DIR")
	}
	if installDir == "" {
		installDir = "/usr/local/bin"
	}

	home, err := os.UserHomeDir()
	if err != nil {
		home = ""
	}

	paths := []string{
		filepath.Join(installDir, binaryName),
	}
	if home != "" {
		paths = append(paths, filepath.Join(home, ".local", "bin", binaryName))
	}
	if goPath := goInstallPath(); goPath != "" {
		paths = append(paths, goPath)
	}
	if p, err := exec.LookPath(binaryName); err == nil {
		paths = append(paths, p)
	}

	return dedupe(paths)
}

func goInstallPath() string {
	goBin, err := exec.Command("go", "env", "GOBIN").Output()
	if err == nil {
		gobin := strings.TrimSpace(string(goBin))
		if gobin != "" {
			return filepath.Join(gobin, binaryName)
		}
	}

	goPath, err := exec.Command("go", "env", "GOPATH").Output()
	if err != nil {
		return ""
	}
	gopath := strings.TrimSpace(string(goPath))
	if gopath == "" {
		return ""
	}
	return filepath.Join(gopath, "bin", binaryName)
}

func dedupe(paths []string) []string {
	seen := make(map[string]struct{}, len(paths))
	out := make([]string, 0, len(paths))
	for _, p := range paths {
		if p == "" {
			continue
		}
		clean := filepath.Clean(p)
		if _, ok := seen[clean]; ok {
			continue
		}
		seen[clean] = struct{}{}
		out = append(out, clean)
	}
	return out
}

func removeBinary(path string) error {
	info, err := os.Stat(path)
	if err != nil {
		if os.IsNotExist(err) {
			return nil
		}
		return err
	}
	if info.IsDir() {
		return fmt.Errorf("%s is a directory", path)
	}

	dir := filepath.Dir(path)
	if err := os.Remove(path); err == nil {
		return nil
	} else if !os.IsPermission(err) {
		return err
	}

	if writable, werr := dirWritable(dir); werr == nil && writable {
		return os.Remove(path)
	}

	cmd := exec.Command("sudo", "rm", "-f", path)
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("remove %s (try: sudo rm %s): %w", path, path, err)
	}
	return nil
}

func dirWritable(dir string) (bool, error) {
	info, err := os.Stat(dir)
	if err != nil {
		return false, err
	}
	if !info.IsDir() {
		return false, fmt.Errorf("%s is not a directory", dir)
	}
	test := filepath.Join(dir, ".openhole-uninstall-write-test")
	if err := os.WriteFile(test, []byte{}, 0o600); err != nil {
		if os.IsPermission(err) {
			return false, nil
		}
		return false, err
	}
	_ = os.Remove(test)
	return true, nil
}

// Run removes openhole from known install locations.
func Run(installDir string) error {
	paths := Candidates(installDir)
	result := Result{Checked: paths}

	fmt.Println("OpenHole uninstall")
	fmt.Println()

	for _, path := range paths {
		info, err := os.Stat(path)
		if err != nil {
			if os.IsNotExist(err) {
				continue
			}
			return err
		}
		if info.IsDir() {
			continue
		}
		if err := removeBinary(path); err != nil {
			return err
		}
		fmt.Printf("✓ Removed %s\n", path)
		result.Removed = append(result.Removed, path)
	}

	if len(result.Removed) == 0 {
		fmt.Println("openhole not found — nothing to remove")
		fmt.Println()
		fmt.Println("Checked:")
		for _, path := range paths {
			fmt.Printf("  %s\n", path)
		}
		return nil
	}

	fmt.Println()
	fmt.Println("Done. OpenHole has been uninstalled.")
	return nil
}
