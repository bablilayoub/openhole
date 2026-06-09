package shared

import (
	"os"
	"os/signal"
	"syscall"
)

// shutdownSignals are OS signals that request graceful exit.
var shutdownSignals = []os.Signal{os.Interrupt, syscall.SIGTERM}

// Shutdown listens for SIGINT/SIGTERM. The first signal runs onShutdown (if set)
// and closes Done. A second signal exits immediately with code 130.
type Shutdown struct {
	done chan struct{}
}

func ListenForShutdown(onShutdown func()) *Shutdown {
	s := &Shutdown{done: make(chan struct{})}
	sigs := make(chan os.Signal, 2)
	signal.Notify(sigs, shutdownSignals...)

	go func() {
		defer signal.Stop(sigs)
		<-sigs
		if onShutdown != nil {
			onShutdown()
		}
		close(s.done)
		<-sigs
		os.Exit(130)
	}()

	return s
}

func (s *Shutdown) Done() <-chan struct{} {
	return s.done
}
