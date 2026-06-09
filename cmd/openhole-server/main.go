package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/bablilayoub/openhole/internal/server"
	"github.com/bablilayoub/openhole/internal/shared"
)

func main() {
	cfg := server.LoadConfig()
	logger := server.NewLogger()
	srv := server.New(cfg, logger)

	addr := ":" + cfg.ServerPort
	httpServer := &http.Server{
		Addr:              addr,
		Handler:           srv.Handler(),
		ReadHeaderTimeout: 10 * time.Second,
		ReadTimeout:       60 * time.Second,
		WriteTimeout:      60 * time.Second,
		IdleTimeout:       120 * time.Second,
		MaxHeaderBytes:    1 << 20,
	}

	go func() {
		logger.Info("starting openhole-server", "addr", addr)
		if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal(err)
		}
	}()

	<-shared.ListenForShutdown(func() {
		logger.Info("shutting down")
	}).Done()
	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	if err := httpServer.Shutdown(ctx); err != nil {
		log.Fatal(err)
	}
}
