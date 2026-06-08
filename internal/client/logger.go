package client

import (
	"fmt"
	"time"

	"github.com/bablilayoub/openhole/internal/shared"
)

func logRequest(method, path string, status int, duration time.Duration) {
	fmt.Printf("%-4s %-20s %3d  %dms\n",
		shared.SafeLogField(method),
		truncatePath(shared.SafeLogField(path), 20),
		status,
		duration.Milliseconds(),
	)
}

func truncatePath(p string, max int) string {
	if len(p) <= max {
		return p
	}
	return p[:max-1] + "…"
}
