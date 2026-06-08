package main

import (
	"fmt"
	"os"
	"strconv"

	"github.com/bablilayoub/openhole/internal/client"
	"github.com/bablilayoub/openhole/internal/shared"
	"github.com/bablilayoub/openhole/internal/uninstall"
	"github.com/bablilayoub/openhole/internal/update"
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
			if err := shared.ValidateHost(host); err != nil {
				return fmt.Errorf("invalid --host: use a hostname without a port (e.g. localhost)")
			}
			if subdomain != "" {
				if err := shared.ValidateSubdomain(subdomain); err != nil {
					return err
				}
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
			update.MaybeNotify()
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

	var installDir string
	uninstallCmd := &cobra.Command{
		Use:   "uninstall",
		Short: "Remove the openhole CLI from your system",
		RunE: func(cmd *cobra.Command, args []string) error {
			return uninstall.Run(installDir)
		},
	}
	uninstallCmd.Flags().StringVar(&installDir, "install-dir", "", "Install directory to check (default: /usr/local/bin or $INSTALL_DIR)")
	root.AddCommand(uninstallCmd)

	var checkOnly bool
	var updateInstallDir string
	updateCmd := &cobra.Command{
		Use:   "update",
		Short: "Check for and install the latest openhole release",
		RunE: func(cmd *cobra.Command, args []string) error {
			if checkOnly {
				return update.PrintStatus(cmd.Context())
			}
			return update.Run(cmd.Context(), updateInstallDir)
		},
	}
	updateCmd.Flags().BoolVar(&checkOnly, "check", false, "Check for updates without installing")
	updateCmd.Flags().StringVar(&updateInstallDir, "install-dir", "", "Install directory (default: current openhole binary path)")
	root.AddCommand(updateCmd)

	if err := root.Execute(); err != nil {
		os.Exit(1)
	}
}
