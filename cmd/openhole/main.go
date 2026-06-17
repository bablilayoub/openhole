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
	var host, subdomain, serverURL, token, configPath string
	var verbose bool
	var verboseSet bool

	root := &cobra.Command{
		Use:          "openhole [port...]",
		Short:        "Expose localhost to the internet",
		Version:      shared.Version,
		SilenceUsage: true,
		Args:         cobra.MinimumNArgs(0),
		RunE: func(cmd *cobra.Command, args []string) error {
			if len(args) == 0 {
				return cmd.Help()
			}
			ports, err := parsePorts(args)
			if err != nil {
				return err
			}
			fileCfg, err := client.LoadFileConfig(configPath)
			if err != nil {
				return fmt.Errorf("config file: %w", err)
			}
			if subdomain != "" {
				if err := shared.ValidateSubdomain(subdomain); err != nil {
					return err
				}
			}
			if len(ports) > 1 && subdomain != "" {
				return fmt.Errorf("--subdomain only applies when exposing a single port")
			}
			base := client.ResolveConfig(fileCfg, ports[0], host, subdomain, serverURL, token, verbose, verboseSet)
			if err := shared.ValidateHost(base.Host); err != nil {
				return fmt.Errorf("invalid --host: use a hostname without a port (e.g. localhost)")
			}
			if verbose {
				for _, port := range ports {
					fmt.Fprintf(os.Stderr, "server=%s host=%s port=%d\n", base.ServerURL, base.Host, port)
				}
			}
			update.MaybeNotify()
			if len(ports) == 1 {
				base.Port = ports[0]
				return client.New(base).Run()
			}
			return client.RunMulti(base, ports)
		},
	}

	root.Flags().StringVar(&host, "host", "", "Local host to forward to (default: localhost)")
	root.Flags().StringVar(&subdomain, "subdomain", "", "Requested subdomain on ophl.link")
	root.Flags().StringVar(&serverURL, "server", "", "Tunnel server WebSocket URL")
	root.Flags().StringVar(&token, "token", "", "Registration token (or set OPENHOLE_TOKEN)")
	root.Flags().StringVar(&configPath, "config", "", "Config file path (default: ~/.config/openhole/config.yaml)")
	root.Flags().BoolVar(&verbose, "verbose", false, "Enable verbose logs")
	root.Flags().Lookup("verbose").NoOptDefVal = "true"
	root.PreRun = func(cmd *cobra.Command, args []string) {
		verboseSet = cmd.Flags().Changed("verbose")
	}

	var installDir string
	uninstallCmd := &cobra.Command{
		Use:          "uninstall",
		Short:        "Remove the openhole CLI from your system",
		SilenceUsage: true,
		RunE: func(cmd *cobra.Command, args []string) error {
			return uninstall.Run(installDir)
		},
	}
	uninstallCmd.Flags().StringVar(&installDir, "install-dir", "", "Install directory to check (default: /usr/local/bin or $INSTALL_DIR)")
	root.AddCommand(uninstallCmd)

	var checkOnly bool
	var updateInstallDir string
	updateCmd := &cobra.Command{
		Use:          "update",
		Short:        "Check for and install the latest openhole release",
		SilenceUsage: true,
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

	statusCmd := &cobra.Command{
		Use:          "status",
		Short:        "Show CLI version and active tunnel info",
		SilenceUsage: true,
		RunE: func(cmd *cobra.Command, args []string) error {
			return client.PrintStatus()
		},
	}
	root.AddCommand(statusCmd)

	var followLogs, jsonLogs bool
	logsCmd := &cobra.Command{
		Use:          "logs",
		Short:        "Show proxied request logs",
		SilenceUsage: true,
		RunE: func(cmd *cobra.Command, args []string) error {
			return client.TailRequestLogs(os.Stdout, followLogs, jsonLogs)
		},
	}
	logsCmd.Flags().BoolVarP(&followLogs, "follow", "f", false, "Stream new log entries")
	logsCmd.Flags().BoolVar(&jsonLogs, "json", false, "Output JSON lines")
	root.AddCommand(logsCmd)

	if err := root.Execute(); err != nil {
		os.Exit(1)
	}
}

func parsePorts(args []string) ([]int, error) {
	ports := make([]int, 0, len(args))
	seen := make(map[int]struct{}, len(args))
	for _, arg := range args {
		port, err := strconv.Atoi(arg)
		if err != nil || port < 1 || port > 65535 {
			return nil, fmt.Errorf("invalid port: %s", arg)
		}
		if _, dup := seen[port]; dup {
			return nil, fmt.Errorf("duplicate port: %d", port)
		}
		seen[port] = struct{}{}
		ports = append(ports, port)
	}
	return ports, nil
}
