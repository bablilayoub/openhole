# Commands

OpenHole is a single binary with a default tunnel command and several subcommands.

```bash
openhole [port...]     # expose local port(s) — default command
openhole status        # version + active tunnels
openhole logs          # request log
openhole update        # self-update
openhole uninstall     # remove CLI
openhole --version     # print version
openhole --help        # help
```

## `openhole [port...]`

Start one or more tunnels. See [CLI usage](usage.md).

```bash
openhole 3000
openhole 3000 8080
openhole 3000 --subdomain myapp --verbose
```

### Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--host` | `localhost` | Local host to forward to |
| `--subdomain` | random | Requested subdomain (single port only) |
| `--server` | see [Configuration](configuration.md) | Tunnel server WebSocket URL |
| `--token` | — | Registration token for protected servers |
| `--config` | `~/.config/openhole/config.yaml` | Config file path |
| `--verbose` | `false` | Debug output on stderr |

---

## `openhole status`

Shows CLI version and active tunnel information.

```bash
openhole status
```

Example output:

```text
openhole v0.2.1

Tunnel running (pid 12345, port 3000)
  URL:    https://myapp.ophl.link
  Local:  http://localhost:3000
  Server: wss://tunnel.openhole.dev/tunnel
  Uptime: 5m 12s

Saved subdomains: myapp
Config: /Users/you/.config/openhole
```

Works from another terminal while a tunnel is running. With multiple tunnels, each port is listed separately.

---

## `openhole logs`

Show proxied HTTP request logs from the ring buffer.

```bash
openhole logs              # print recent entries
openhole logs -f           # follow new entries (like tail -f)
openhole logs --json       # JSON lines for scripting
openhole logs -f --json    # follow + JSON
```

Logs are stored at `~/.config/openhole/requests.jsonl` (max 1000 lines).

### JSON format

```json
{"time":"2026-06-17T12:00:00Z","port":3000,"method":"GET","path":"/api","status":200,"duration_ms":12}
```

---

## `openhole update`

Download and install the latest release from GitHub.

```bash
openhole update
openhole update --check           # check only
openhole update --install-dir /usr/local/bin
```

- Verifies SHA256 against `checksums.txt`
- Replaces the current binary in place
- Supports macOS, Linux, and Windows

---

## `openhole uninstall`

Remove the `openhole` binary from common install locations.

```bash
openhole uninstall
openhole uninstall --install-dir /custom/path
```

Checks `/usr/local/bin`, `~/.local/bin`, Go bin directory, and `PATH`.

---

## Environment variables

| Variable | Description |
|----------|-------------|
| `OPENHOLE_SERVER_URL` | Default tunnel server WebSocket URL |
| `OPENHOLE_TOKEN` | Registration token |
| `OPENHOLE_CONFIG_DIR` | Override `~/.config/openhole` |
| `OPENHOLE_SKIP_UPDATE_CHECK` | Set to `1` to disable update hints |
| `OPENHOLE_INSTALL_URL` | Override install script URL for update errors |
| `OPENHOLE_NO_COLOR` | Disable colored terminal output |

See [Configuration](configuration.md) for the full reference.
