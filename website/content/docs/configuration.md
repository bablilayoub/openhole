# Configuration

## Precedence

Settings are resolved in this order (later wins):

1. Built-in defaults
2. `~/.config/openhole/config.yaml`
3. Environment variables
4. CLI flags

## Config file

Path: `~/.config/openhole/config.yaml` (override with `--config`).

```yaml
# Tunnel server WebSocket URL
server: wss://tunnel.openhole.dev/tunnel

# Local host to forward to
host: localhost

# Request a specific subdomain (single-port tunnels only)
subdomain: myapp

# Registration token for protected servers
token: your-secret

# Verbose stderr output
verbose: false
```

Example for self-hosted teams:

```yaml
server: wss://tunnel.myteam.dev/tunnel
token: team-shared-secret
host: localhost
```

See `packaging/config.example.yaml` in the repository.

---

## CLI flags

| Flag | Default | Description |
|------|---------|-------------|
| `port` | — | Local port(s) to expose (required) |
| `--host` | `localhost` | Local host |
| `--subdomain` | random | Requested subdomain |
| `--server` | `wss://tunnel.openhole.dev/tunnel` | Tunnel server URL |
| `--token` | — | Registration token |
| `--config` | `~/.config/openhole/config.yaml` | Config file path |
| `--verbose` | `false` | Debug logging |

---

## Client environment variables

| Variable | Description |
|----------|-------------|
| `OPENHOLE_SERVER_URL` | WebSocket URL of tunnel server |
| `OPENHOLE_TOKEN` | Registration token |
| `OPENHOLE_CONFIG_DIR` | Config directory (default: `~/.config/openhole`) |
| `OPENHOLE_SKIP_UPDATE_CHECK` | `1` disables daily update notification |
| `OPENHOLE_INSTALL_URL` | Custom install script URL (shown in update errors) |
| `OPENHOLE_NO_COLOR` | Disable ANSI colors |

---

## Server environment variables

Used by `openhole-server` (self-hosted). Full template: `deployments/env.example`.

| Variable | Default | Description |
|----------|---------|-------------|
| `PUBLIC_TUNNEL_DOMAIN` | `ophl.link` | Domain for public tunnel URLs |
| `TUNNEL_ENDPOINT_HOST` | `tunnel.openhole.dev` | WebSocket endpoint hostname |
| `SERVER_PORT` | `8080` | HTTP listen port |
| `PUBLIC_URL_SCHEME` | `https` | Scheme in URLs sent to clients |
| `TRUST_PROXY_HEADERS` | `false` | Trust `X-Forwarded-For` from reverse proxy |
| `MAX_BODY_BYTES` | `10485760` | Max request/response body (10 MB) |
| `REQUEST_TIMEOUT_SECONDS` | `30` | Per-request timeout |
| `MAX_CONCURRENT_REQUESTS_PER_TUNNEL` | `25` | Concurrent HTTP requests per tunnel |
| `MAX_TUNNELS_PER_IP` | `3` | Active tunnels per IP |
| `MAX_REGISTRATIONS_PER_IP_PER_MINUTE` | `5` | Registration rate limit |
| `MAX_PUBLIC_REQUESTS_PER_IP_PER_MINUTE` | `120` | Public request rate limit |
| `SUBDOMAIN_HOLD_SECONDS` | `30` | Hold period after disconnect |
| `REGISTRATION_TOKENS` | — | Comma-separated tokens required to register (empty = open) |
| `BLOCKED_IPS` | — | Comma-separated blocked IPs |
| `BLOCKED_SUBDOMAINS_EXTRA` | — | Extra reserved subdomain names |

### Registration tokens

When `REGISTRATION_TOKENS` is set, clients must pass a matching token:

```bash
# Server .env
REGISTRATION_TOKENS=secret-one,secret-two

# Client
openhole 3000 --token secret-one
```

Leave empty on the public OpenHole service — registration stays open.

---

## Local files

| Path | Description |
|------|-------------|
| `config.yaml` | User defaults |
| `sessions.json` | Active tunnel sessions |
| `reclaim.json` | Subdomain reclaim tokens |
| `requests.jsonl` | Request log ring buffer |

All under `OPENHOLE_CONFIG_DIR` or `~/.config/openhole`.
