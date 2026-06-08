package shared

import (
	"os"
	"strconv"
)

const (
	ansiReset  = "\033[0m"
	AnsiBold   = "\033[1m"
	AnsiDim    = "\033[2m"
	AnsiRed    = "\033[31m"
	AnsiGreen  = "\033[32m"
	AnsiYellow = "\033[33m"
	AnsiCyan   = "\033[36m"
)

func terminalColorEnabled(out *os.File) bool {
	if os.Getenv("NO_COLOR") != "" || os.Getenv("OPENHOLE_NO_COLOR") != "" {
		return false
	}
	stat, err := out.Stat()
	if err != nil {
		return false
	}
	return (stat.Mode() & os.ModeCharDevice) != 0
}

// TerminalColorEnabled reports whether ANSI colors should be used on stdout.
func TerminalColorEnabled() bool {
	return terminalColorEnabled(os.Stdout)
}

// Paint applies an ANSI style when writing to stdout.
func Paint(code, s string) string {
	return paint(os.Stdout, code, s)
}

// PaintErr applies an ANSI style when writing to stderr.
func PaintErr(code, s string) string {
	return paint(os.Stderr, code, s)
}

func paint(out *os.File, code, s string) string {
	if !terminalColorEnabled(out) {
		return s
	}
	return code + s + ansiReset
}

// PaintStatus colors an HTTP status code for request logs.
func PaintStatus(code int) string {
	switch {
	case code >= 200 && code < 300:
		return Paint(AnsiGreen, strconv.Itoa(code))
	case code >= 300 && code < 400:
		return Paint(AnsiYellow, strconv.Itoa(code))
	default:
		return Paint(AnsiRed, strconv.Itoa(code))
	}
}
