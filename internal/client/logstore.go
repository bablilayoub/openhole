package client

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"time"

	"github.com/bablilayoub/openhole/internal/shared"
)

const maxLogLines = 1000

// RequestLogEntry is one proxied HTTP request record.
type RequestLogEntry struct {
	Time       time.Time `json:"time"`
	Port       int       `json:"port"`
	Method     string    `json:"method"`
	Path       string    `json:"path"`
	Status     int       `json:"status"`
	DurationMs int64     `json:"duration_ms"`
}

func requestLogPath() (string, error) {
	dir, err := configDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(dir, "requests.jsonl"), nil
}

func appendRequestLog(port int, method, path string, status int, duration time.Duration) {
	entry := RequestLogEntry{
		Time:       time.Now().UTC(),
		Port:       port,
		Method:     shared.SafeLogField(method),
		Path:       shared.SafeLogField(path),
		Status:     status,
		DurationMs: duration.Milliseconds(),
	}
	data, err := json.Marshal(entry)
	if err != nil {
		return
	}

	logPath, err := requestLogPath()
	if err != nil {
		return
	}
	if err := os.MkdirAll(filepath.Dir(logPath), 0o700); err != nil {
		return
	}

	f, err := os.OpenFile(logPath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o600)
	if err != nil {
		return
	}
	defer f.Close()
	_, _ = f.Write(append(data, '\n'))
	_ = trimRequestLog(logPath)
}

func trimRequestLog(path string) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return err
	}
	lines := splitLines(data)
	if len(lines) <= maxLogLines {
		return nil
	}
	trimmed := append([]byte(nil), joinLines(lines[len(lines)-maxLogLines:])...)
	tmp := path + ".tmp"
	if err := os.WriteFile(tmp, trimmed, 0o600); err != nil {
		return err
	}
	return os.Rename(tmp, path)
}

func splitLines(data []byte) [][]byte {
	var lines [][]byte
	start := 0
	for i, b := range data {
		if b == '\n' {
			line := data[start:i]
			if len(line) > 0 {
				lines = append(lines, line)
			}
			start = i + 1
		}
	}
	if start < len(data) {
		lines = append(lines, data[start:])
	}
	return lines
}

func joinLines(lines [][]byte) []byte {
	var out []byte
	for i, line := range lines {
		out = append(out, line...)
		if i < len(lines)-1 {
			out = append(out, '\n')
		}
	}
	if len(lines) > 0 {
		out = append(out, '\n')
	}
	return out
}

// TailRequestLogs prints log entries, optionally following new lines.
func TailRequestLogs(w io.Writer, follow, asJSON bool) error {
	path, err := requestLogPath()
	if err != nil {
		return err
	}

	if follow {
		return tailFollow(w, path, asJSON)
	}
	return printExisting(w, path, asJSON)
}

func printExisting(w io.Writer, path string, asJSON bool) error {
	f, err := os.Open(path)
	if err != nil {
		if os.IsNotExist(err) {
			fmt.Fprintln(w, shared.Paint(shared.AnsiDim, "No request logs yet."))
			return nil
		}
		return err
	}
	defer f.Close()
	return scanLines(w, f, asJSON)
}

func tailFollow(w io.Writer, path string, asJSON bool) error {
	if err := printExisting(w, path, asJSON); err != nil {
		return err
	}

	var offset int64
	if st, err := os.Stat(path); err == nil {
		offset = st.Size()
	}

	for {
		f, err := os.Open(path)
		if err != nil {
			if os.IsNotExist(err) {
				time.Sleep(500 * time.Millisecond)
				continue
			}
			return err
		}
		if _, err := f.Seek(offset, io.SeekStart); err != nil {
			f.Close()
			return err
		}
		scanner := bufio.NewScanner(f)
		for scanner.Scan() {
			line := scanner.Bytes()
			if len(line) == 0 {
				continue
			}
			if err := printLogLine(w, line, asJSON); err != nil {
				f.Close()
				return err
			}
		}
		if st, err := f.Stat(); err == nil {
			offset = st.Size()
		}
		f.Close()
		time.Sleep(300 * time.Millisecond)
	}
}

func scanLines(w io.Writer, r io.Reader, asJSON bool) error {
	scanner := bufio.NewScanner(r)
	for scanner.Scan() {
		line := scanner.Bytes()
		if len(line) == 0 {
			continue
		}
		if err := printLogLine(w, line, asJSON); err != nil {
			return err
		}
	}
	return scanner.Err()
}

func printLogLine(w io.Writer, line []byte, asJSON bool) error {
	if asJSON {
		_, err := fmt.Fprintf(w, "%s\n", line)
		return err
	}
	var entry RequestLogEntry
	if err := json.Unmarshal(line, &entry); err != nil {
		_, err := fmt.Fprintf(w, "%s\n", line)
		return err
	}
	method := shared.SafeLogField(entry.Method)
	path := truncatePath(shared.SafeLogField(entry.Path), 20)
	ms := fmt.Sprintf("%dms", entry.DurationMs)
	port := ""
	if entry.Port > 0 {
		port = fmt.Sprintf(":%d ", entry.Port)
	}
	if shared.TerminalColorEnabled() {
		_, err := fmt.Fprintf(w, "%s%s %-20s %s  %s\n",
			shared.Paint(shared.AnsiDim, port),
			shared.Paint(shared.AnsiBold, fmt.Sprintf("%-4s", method)),
			path,
			fmt.Sprintf("%3s", shared.PaintStatus(entry.Status)),
			shared.Paint(shared.AnsiDim, ms),
		)
		return err
	}
	_, err := fmt.Fprintf(w, "%s%-4s %-20s %3d  %s\n", port, method, path, entry.Status, ms)
	return err
}
