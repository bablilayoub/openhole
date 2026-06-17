package client

import (
	"fmt"
	"time"

	"github.com/bablilayoub/openhole/internal/shared"
)

func logRequest(port int, method, path string, status int, duration time.Duration) {
	appendRequestLog(port, method, path, status, duration)
	method = shared.SafeLogField(method)
	path = truncatePath(shared.SafeLogField(path), 20)
	ms := fmt.Sprintf("%dms", duration.Milliseconds())

	if shared.TerminalColorEnabled() {
		fmt.Printf("%s %-20s %s  %s\n",
			shared.Paint(shared.AnsiBold, fmt.Sprintf("%-4s", method)),
			path,
			fmt.Sprintf("%3s", shared.PaintStatus(status)),
			shared.Paint(shared.AnsiDim, ms),
		)
		return
	}

	fmt.Printf("%-4s %-20s %3d  %s\n", method, path, status, ms)
}

func truncatePath(p string, max int) string {
	if len(p) <= max {
		return p
	}
	return p[:max-1] + "…"
}
