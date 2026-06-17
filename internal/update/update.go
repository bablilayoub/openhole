package update

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"time"

	"github.com/bablilayoub/openhole/internal/shared"
)

const (
	defaultRepo       = "bablilayoub/openhole"
	checkInterval     = 24 * time.Hour
	httpTimeout       = 15 * time.Second
	cacheDirName      = "openhole"
	cacheFileName     = "update.json"
	envSkipCheck      = "OPENHOLE_SKIP_UPDATE_CHECK"
	envInstallScript  = "OPENHOLE_INSTALL_URL"
	defaultInstallURL = "https://openhole.dev/install.sh"
)

type cacheState struct {
	CheckedAt          time.Time `json:"checked_at"`
	Latest             string    `json:"latest"`
	LastNotifiedLatest string    `json:"last_notified_latest"`
}

type releaseInfo struct {
	TagName string `json:"tag_name"`
}

func repo() string {
	return defaultRepo
}

func installScriptURL() string {
	if v := strings.TrimSpace(os.Getenv(envInstallScript)); v != "" {
		return v
	}
	return defaultInstallURL
}

func normalizeVersion(v string) string {
	return strings.TrimPrefix(strings.TrimSpace(v), "v")
}

// CompareVersions returns -1 if current < latest, 0 if equal, 1 if current > latest.
func CompareVersions(current, latest string) int {
	c := strings.Split(normalizeVersion(current), ".")
	l := strings.Split(normalizeVersion(latest), ".")

	for i := 0; i < max(len(c), len(l)); i++ {
		cn := partAt(c, i)
		ln := partAt(l, i)
		if cn < ln {
			return -1
		}
		if cn > ln {
			return 1
		}
	}
	return 0
}

func partAt(parts []string, i int) int {
	if i >= len(parts) {
		return 0
	}
	n, err := strconv.Atoi(parts[i])
	if err != nil {
		return 0
	}
	return n
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func FetchLatest(ctx context.Context) (string, error) {
	url := fmt.Sprintf("https://api.github.com/repos/%s/releases/latest", repo())
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return "", err
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("User-Agent", "openhole-cli")

	client := &http.Client{Timeout: httpTimeout}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("release check failed: HTTP %d", resp.StatusCode)
	}

	var info releaseInfo
	if err := json.NewDecoder(resp.Body).Decode(&info); err != nil {
		return "", err
	}
	if info.TagName == "" {
		return "", fmt.Errorf("release check failed: empty tag")
	}
	return normalizeVersion(info.TagName), nil
}

func cachePath() (string, error) {
	dir, err := os.UserCacheDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(dir, cacheDirName, cacheFileName), nil
}

func loadCache() (cacheState, error) {
	path, err := cachePath()
	if err != nil {
		return cacheState{}, err
	}
	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return cacheState{}, nil
		}
		return cacheState{}, err
	}
	var state cacheState
	if err := json.Unmarshal(data, &state); err != nil {
		return cacheState{}, nil
	}
	return state, nil
}

func saveCache(state cacheState) error {
	path, err := cachePath()
	if err != nil {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}
	data, err := json.Marshal(state)
	if err != nil {
		return err
	}
	return os.WriteFile(path, data, 0o644)
}

func resolveLatest(ctx context.Context, state cacheState, forceRefresh bool) (string, cacheState, error) {
	if !forceRefresh && !state.CheckedAt.IsZero() && time.Since(state.CheckedAt) < checkInterval && state.Latest != "" {
		return state.Latest, state, nil
	}

	latest, err := FetchLatest(ctx)
	if err != nil {
		return "", state, err
	}

	state.CheckedAt = time.Now()
	state.Latest = latest
	return latest, state, nil
}

// Status reports whether a newer release is available.
func Status(ctx context.Context) (latest string, available bool, err error) {
	state, err := loadCache()
	if err != nil {
		return "", false, err
	}

	latest, state, err = resolveLatest(ctx, state, false)
	if err != nil {
		return "", false, err
	}
	_ = saveCache(state)

	return latest, CompareVersions(shared.Version, latest) < 0, nil
}

// MaybeNotify checks for updates in the background and prints a hint when outdated.
func MaybeNotify() {
	if os.Getenv(envSkipCheck) == "1" {
		return
	}

	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), httpTimeout)
		defer cancel()

		state, err := loadCache()
		if err != nil {
			return
		}

		latest, state, err := resolveLatest(ctx, state, false)
		if err != nil {
			return
		}

		if CompareVersions(shared.Version, latest) < 0 && state.LastNotifiedLatest != latest {
			msg := fmt.Sprintf(
				"→ Update available: v%s (you have v%s). Run: openhole update",
				latest, shared.Version,
			)
			fmt.Fprintf(os.Stderr, "\n%s\n\n", shared.PaintErr(shared.AnsiYellow, msg))
			state.LastNotifiedLatest = latest
		}

		_ = saveCache(state)
	}()
}

// PrintStatus prints the current and latest versions.
func PrintStatus(ctx context.Context) error {
	latest, available, err := Status(ctx)
	if err != nil {
		return err
	}

	fmt.Println(shared.Paint(shared.AnsiBold, "openhole v"+shared.Version))
	if available {
		fmt.Println(shared.Paint(shared.AnsiYellow, fmt.Sprintf("Latest:  v%s (update available)", latest)))
		fmt.Println(shared.Paint(shared.AnsiDim, "Run: openhole update"))
		return nil
	}
	fmt.Println(shared.Paint(shared.AnsiGreen, fmt.Sprintf("Latest:  v%s (up to date)", latest)))
	return nil
}

// Run downloads and installs the latest release over the current binary.
func Run(ctx context.Context, installDir string) error {
	state, err := loadCache()
	if err != nil {
		return err
	}

	latest, state, err := resolveLatest(ctx, state, true)
	if err != nil {
		return err
	}
	_ = saveCache(state)

	if CompareVersions(shared.Version, latest) >= 0 {
		fmt.Println(shared.Paint(shared.AnsiGreen, fmt.Sprintf("Already on the latest version (v%s).", shared.Version)))
		return nil
	}

	target, err := installTarget(installDir)
	if err != nil {
		return err
	}

	fmt.Println(shared.Paint(shared.AnsiCyan, fmt.Sprintf("Updating openhole v%s → v%s", shared.Version, latest)))

	tmp, err := downloadRelease(ctx, latest)
	if err != nil {
		return err
	}
	defer os.Remove(tmp)

	if err := installBinary(target, tmp); err != nil {
		return err
	}

	fmt.Println(shared.Paint(shared.AnsiGreen, "✓ Updated to v"+latest))
	fmt.Println(shared.Paint(shared.AnsiDim, "  Installed to "+target))
	return nil
}

func installTarget(installDir string) (string, error) {
	name := "openhole"
	if runtime.GOOS == "windows" {
		name = "openhole.exe"
	}
	if installDir != "" {
		return filepath.Join(installDir, name), nil
	}
	exe, err := os.Executable()
	if err != nil {
		return "", err
	}
	return filepath.EvalSymlinks(exe)
}

func platformBinary() (osName, arch, file string, err error) {
	switch runtime.GOOS {
	case "darwin":
		osName = "darwin"
	case "linux":
		osName = "linux"
	case "windows":
		osName = "windows"
	default:
		return "", "", "", fmt.Errorf("unsupported OS for self-update: %s", runtime.GOOS)
	}

	switch runtime.GOARCH {
	case "amd64":
		arch = "amd64"
	case "arm64":
		arch = "arm64"
	default:
		return "", "", "", fmt.Errorf("unsupported architecture for self-update: %s", runtime.GOARCH)
	}

	suffix := ""
	if osName == "windows" {
		suffix = ".exe"
	}
	return osName, arch, fmt.Sprintf("openhole-%s-%s%s", osName, arch, suffix), nil
}

func downloadRelease(ctx context.Context, version string) (string, error) {
	_, _, binary, err := platformBinary()
	if err != nil {
		return "", err
	}

	baseURL := fmt.Sprintf("https://github.com/%s/releases/download/v%s", repo(), version)
	downloadURL := baseURL + "/" + binary
	checksumsURL := baseURL + "/checksums.txt"

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, downloadURL, nil)
	if err != nil {
		return "", err
	}
	req.Header.Set("User-Agent", "openhole-cli")

	client := &http.Client{Timeout: httpTimeout}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("download failed: HTTP %d", resp.StatusCode)
	}

	tmp, err := os.CreateTemp("", "openhole-update-*")
	if err != nil {
		return "", err
	}
	tmpPath := tmp.Name()

	if _, err := io.Copy(tmp, io.LimitReader(resp.Body, 64<<20)); err != nil {
		tmp.Close()
		os.Remove(tmpPath)
		return "", err
	}
	if err := tmp.Close(); err != nil {
		os.Remove(tmpPath)
		return "", err
	}
	if err := os.Chmod(tmpPath, 0o755); err != nil {
		os.Remove(tmpPath)
		return "", err
	}

	if err := verifyChecksum(ctx, tmpPath, binary, checksumsURL); err != nil {
		os.Remove(tmpPath)
		return "", err
	}

	return tmpPath, nil
}

func verifyChecksum(ctx context.Context, file, binary, checksumsURL string) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, checksumsURL, nil)
	if err != nil {
		return err
	}
	req.Header.Set("User-Agent", "openhole-cli")

	client := &http.Client{Timeout: httpTimeout}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("could not fetch checksums.txt: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("checksums.txt not found: HTTP %d", resp.StatusCode)
	}

	data, err := io.ReadAll(io.LimitReader(resp.Body, 1<<20))
	if err != nil {
		return err
	}

	expected := ""
	for _, line := range strings.Split(string(data), "\n") {
		fields := strings.Fields(line)
		if len(fields) == 2 && fields[1] == binary {
			expected = fields[0]
			break
		}
	}
	if expected == "" {
		return fmt.Errorf("no checksum entry for %s", binary)
	}

	f, err := os.Open(file)
	if err != nil {
		return err
	}
	defer f.Close()

	hash := sha256.New()
	if _, err := io.Copy(hash, f); err != nil {
		return err
	}
	actual := hex.EncodeToString(hash.Sum(nil))
	if actual != expected {
		return fmt.Errorf("checksum mismatch for %s", binary)
	}

	fmt.Fprintln(os.Stderr, shared.PaintErr(shared.AnsiGreen, "✓ Checksum verified"))
	return nil
}

func installBinary(dest, src string) error {
	dir := filepath.Dir(dest)
	if writable, err := dirWritable(dir); err == nil && writable {
		if err := os.Remove(dest); err != nil && !os.IsNotExist(err) {
			return err
		}
		in, err := os.Open(src)
		if err != nil {
			return err
		}
		defer in.Close()

		out, err := os.OpenFile(dest, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0o755)
		if err != nil {
			return err
		}
		if _, err := io.Copy(out, in); err != nil {
			out.Close()
			return err
		}
		return out.Close()
	}

	if runtime.GOOS == "windows" {
		return fmt.Errorf("install to %s requires write access — re-run as administrator or use install.ps1", dest)
	}

	cmd := exec.Command("sudo", "install", "-m", "755", src, dest)
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		return fmt.Errorf("install to %s (try: curl -fsSL %s | sh): %w", dest, installScriptURL(), err)
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
	test := filepath.Join(dir, ".openhole-update-write-test")
	if err := os.WriteFile(test, []byte{}, 0o600); err != nil {
		if os.IsPermission(err) {
			return false, nil
		}
		return false, err
	}
	_ = os.Remove(test)
	return true, nil
}
