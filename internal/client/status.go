package client

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/bablilayoub/openhole/internal/shared"
)

func PrintStatus() error {
	fmt.Println(shared.Paint(shared.AnsiBold, "openhole v"+shared.Version))
	fmt.Println()

	clearStaleSession()
	if s, ok := loadSession(); ok && processAlive(s.PID) {
		uptime := time.Since(s.StartedAt).Round(time.Second)
		fmt.Println(shared.Paint(shared.AnsiGreen, fmt.Sprintf("Tunnel running (pid %d)", s.PID)))
		fmt.Printf("  %s %s\n", shared.Paint(shared.AnsiDim, "URL:"), shared.Paint(shared.AnsiCyan, s.PublicURL))
		fmt.Printf("  %s http://%s:%d\n", shared.Paint(shared.AnsiDim, "Local:"), s.Host, s.Port)
		fmt.Printf("  %s %s\n", shared.Paint(shared.AnsiDim, "Server:"), s.ServerURL)
		fmt.Printf("  %s %s\n", shared.Paint(shared.AnsiDim, "Uptime:"), formatDuration(uptime))
	} else {
		fmt.Println(shared.Paint(shared.AnsiDim, "No active tunnel."))
	}

	names := listSavedSubdomains()
	fmt.Println()
	if len(names) > 0 {
		fmt.Printf("%s %s\n", shared.Paint(shared.AnsiDim, "Saved subdomains:"), strings.Join(names, ", "))
	} else {
		fmt.Println(shared.Paint(shared.AnsiDim, "No saved subdomains."))
	}

	if dir, err := configDir(); err == nil {
		fmt.Printf("%s %s\n", shared.Paint(shared.AnsiDim, "Config:"), dir)
	}

	return nil
}

func formatDuration(d time.Duration) string {
	if d < time.Minute {
		return fmt.Sprintf("%ds", int(d.Seconds()))
	}
	if d < time.Hour {
		return fmt.Sprintf("%dm %ds", int(d.Minutes()), int(d.Seconds())%60)
	}
	h := int(d.Hours())
	m := int(d.Minutes()) % 60
	if m == 0 {
		return fmt.Sprintf("%dh", h)
	}
	return fmt.Sprintf("%dh %dm", h, m)
}

func listSavedSubdomains() []string {
	path, err := reclaimStorePath()
	if err != nil {
		return nil
	}
	data, err := os.ReadFile(path)
	if err != nil {
		return nil
	}
	var store reclaimStore
	if err := json.Unmarshal(data, &store); err != nil || len(store.Tokens) == 0 {
		return nil
	}
	names := make([]string, 0, len(store.Tokens))
	for name := range store.Tokens {
		names = append(names, name)
	}
	// simple sort for stable output
	for i := 0; i < len(names); i++ {
		for j := i + 1; j < len(names); j++ {
			if names[j] < names[i] {
				names[i], names[j] = names[j], names[i]
			}
		}
	}
	return names
}
