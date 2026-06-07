package main

import (
	"log"
	"net/http"

	"github.com/bablilayoub/openhole/internal/server"
)

func main() {
	cfg := server.LoadConfig()
	logger := server.NewLogger()
	srv := server.New(cfg, logger)

	addr := ":" + cfg.ServerPort
	logger.Info("starting openhole-server", "addr", addr)
	if err := http.ListenAndServe(addr, srv.Handler()); err != nil {
		log.Fatal(err)
	}
}
