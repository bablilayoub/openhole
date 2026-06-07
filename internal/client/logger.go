package client

import (
	"fmt"
	"time"
)

func logRequest(method, path string, status int, duration time.Duration) {
	fmt.Printf("%-4s %-20s %3d  %dms\n", method, truncatePath(path, 20), status, duration.Milliseconds())
}

func truncatePath(p string, max int) string {
	if len(p) <= max {
		return p
	}
	return p[:max-1] + "…"
}
