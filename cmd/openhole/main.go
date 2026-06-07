package main

import (
	"fmt"
	"os"
	"strconv"

	"github.com/bablilayoub/openhole/internal/client"
	"github.com/bablilayoub/openhole/internal/shared"
	"github.com/spf13/cobra"
)

func main() {
	var host, subdomain, serverURL string
	var verbose bool

	root := &cobra.Command{
		Use:     "openhole [port]",
		Short:   "Expose localhost to the internet",
		Version: shared.Version,
		Args:    cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			if len(args) == 0 {
				return cmd.Help()
			}
			port, err := strconv.Atoi(args[0])
			if err != nil || port < 1 || port > 65535 {
				return fmt.Errorf("invalid port: %s", args[0])
			}
			if host == "" {
				host = "localhost"
			}
			if serverURL == "" {
				serverURL = os.Getenv("OPENHOLE_SERVER_URL")
			}
			if serverURL == "" {
				serverURL = "wss://tunnel.openhole.dev/tunnel"
			}
			if verbose {
				fmt.Fprintf(os.Stderr, "server=%s host=%s port=%d\n", serverURL, host, port)
			}
			c := client.New(client.Config{
				Port:      port,
				Host:      host,
				Subdomain: subdomain,
				ServerURL: serverURL,
				Verbose:   verbose,
			})
			return c.Run()
		},
	}

	root.Flags().StringVar(&host, "host", "localhost", "Local host to forward to")
	root.Flags().StringVar(&subdomain, "subdomain", "", "Requested subdomain on ophl.link")
	root.Flags().StringVar(&serverURL, "server", "", "Tunnel server WebSocket URL")
	root.Flags().BoolVar(&verbose, "verbose", false, "Enable verbose logs")

	if err := root.Execute(); err != nil {
		os.Exit(1)
	}
}
