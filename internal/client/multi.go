package client

import (
	"fmt"
	"os"
	"sync"

	"github.com/bablilayoub/openhole/internal/shared"
)

// RunMulti starts one tunnel per port in a single process.
func RunMulti(base Config, ports []int) error {
	clearStaleSessions()

	shutdown := shared.ListenForShutdown(func() {
		fmt.Fprintln(os.Stderr, shared.Paint(shared.AnsiDim, "\nShutting down..."))
	})
	done := shutdown.Done()

	var wg sync.WaitGroup
	errCh := make(chan error, len(ports))

	for _, port := range ports {
		cfg := base
		cfg.Port = port
		// Named subdomains only apply to a single tunnel.
		if len(ports) > 1 {
			cfg.Subdomain = ""
		}
		wg.Add(1)
		go func(c Config) {
			defer wg.Done()
			if err := New(c).RunUntil(done); err != nil {
				errCh <- err
			}
		}(cfg)
	}

	wg.Wait()
	close(errCh)

	for err := range errCh {
		if err != nil {
			return err
		}
	}
	return nil
}
