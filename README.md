# OpenHole

Expose a local HTTP server to the internet with one command. No accounts, no API keys, no dashboard.

```bash
openhole 3000
```

```text
https://blue-fox.ophl.link  →  http://localhost:3000
```

---

## Table of contents

- [Install](#install)
- [Usage](#usage)
- [How it works](#how-it-works)
- [Security](#security)
- [Self-hosting](#self-hosting)
- [Local development](#local-development)
- [Configuration reference](#configuration-reference)
- [Limitations](#limitations)
- [Contributing](#contributing)
- [License](#license)

---

## Install

### Option A — Install script (macOS / Linux)

```bash
curl -fsSL https://openhole.dev/install.sh | sh
```

Downloads the latest release binary from GitHub, verifies its SHA256 checksum (when `checksums.txt` is published), and installs it to `/usr/local/bin` (or `~/.local/bin` if you lack write access).

Pin a specific version:

```bash
OPENHOLE_VERSION=v0.1.0 curl -fsSL https://openhole.dev/install.sh | sh
```

### Option B — Go install

```bash
go install github.com/bablilayoub/openhole/cmd/openhole@latest
```

### Option C — Build from source

```bash
git clone https://github.com/bablilayoub/openhole.git
cd openhole
./scripts/build.sh
```

Binaries are written to `dist/`.

### Uninstall

```bash
openhole uninstall
```

Or without the CLI installed:

```bash
curl -fsSL https://openhole.dev/uninstall.sh | sh
```

Removes `openhole` from `/usr/local/bin`, `~/.local/bin`, and the Go bin directory (if present). Uses `sudo` only when needed.

---

## Usage

```bash
# Expose port 3000 (random subdomain assigned)
openhole 3000

# Request a specific subdomain
openhole 3000 --subdomain myapp

# Forward to a non-default local host
openhole 3000 --host 127.0.0.1

# Point at a custom tunnel server (self-hosted)
openhole 3000 --server wss://tunnel.example.com/tunnel

# Same as --server, via environment variable
export OPENHOLE_SERVER_URL=wss://tunnel.example.com/tunnel
openhole 3000

# Print version
openhole --version
```

### What you see

```text
OpenHole v0.1.0

✓ Tunnel ready
→ https://blue-fox.ophl.link
→ forwarding to http://localhost:3000

Requests:
GET  /api/users          200  12ms
POST /webhooks/stripe    201  45ms
```

The CLI reconnects automatically if the connection drops. Your subdomain may change on reconnect unless you use `--subdomain`.

---

## How it works

```text
Internet request
    ↓
Caddy (TLS termination)
    ↓
openhole-server  ←WebSocket→  openhole CLI  →  localhost:PORT
```

1. The CLI opens a WebSocket to the tunnel server and registers a subdomain.
2. Public HTTPS traffic hits `https://<subdomain>.ophl.link`.
3. The server forwards each HTTP request over the WebSocket to your CLI.
4. The CLI proxies the request to your local app and sends the response back.

---

## Security

**OpenHole exposes your local service to the public internet.** Anyone with the URL can access it.

- Do not tunnel admin panels, databases, `.env` files, or internal APIs you would not publish publicly.
- Tunnels are unauthenticated — anyone can register one if they can reach the server.
- Use `--subdomain` for stable webhook URLs; random subdomains change on reconnect.
- Report abuse: [abuse@openhole.dev](mailto:abuse@openhole.dev)
- Acceptable use policy: [openhole.dev/terms](https://openhole.dev/terms)

### Built-in protections

| Protection | Default |
|------------|---------|
| HTTPS (TLS) | Automatic via Caddy |
| Body size limit | 10 MB per request/response |
| Rate limits | Per-IP registration and request limits |
| Blocked subdomains | Reserved names (admin, api, www, …) |
| Header sanitization | Spoofed `X-Forwarded-*` stripped before reaching your app |

---

## Self-hosting

Run your own tunnel infrastructure with Docker Compose.

### Prerequisites

| Requirement | Notes |
|-------------|-------|
| VPS | Docker + Docker Compose installed |
| Domain for marketing site | e.g. `openhole.dev` |
| Domain for tunnels | e.g. `ophl.link` |
| Cloudflare account | DNS-01 wildcard TLS for `*.ophl.link` |
| Cloudflare API token | Zone → DNS → Edit on both zones |

### 1. Configure environment

```bash
cd deployments
cp env.example .env
```

Edit `.env` and set at minimum:

```bash
CLOUDFLARE_API_TOKEN=your_token_here
CADDY_ACME_EMAIL=admin@yourdomain.com
PUBLIC_TUNNEL_DOMAIN=ophl.link
TUNNEL_ENDPOINT_HOST=tunnel.yourdomain.com
NEXT_PUBLIC_TUNNEL_DOMAIN=ophl.link
```

`TRUST_PROXY_HEADERS=true` is required in Docker (Caddy sits in front of the server). Never expose port `8080` directly to the internet with this enabled — clients could spoof their IP.

### 2. DNS records (Cloudflare)

| Zone | Record | Target | Proxy status |
|------|--------|--------|--------------|
| `yourdomain.dev` | A `@` | VPS IP | DNS only (grey cloud) recommended for ACME |
| `yourdomain.dev` | A `www` | VPS IP | DNS only recommended |
| `yourdomain.dev` | A `tunnel` | VPS IP | **DNS only** (required) |
| `ophl.link` | A `@` | VPS IP | **DNS only** (required) |
| `ophl.link` | A `*` | VPS IP | **DNS only** (required) |

Orange-cloud (proxied) records on `tunnel.*` or `*.ophl.link` will break tunnel routing.

### 3. Deploy

```bash
docker compose up -d --build
```

Verify the server is healthy:

```bash
curl https://tunnel.yourdomain.com/health
# {"status":"ok"}
```

### 4. Connect the CLI to your server

The CLI defaults to the public OpenHole server. For self-hosted, always pass `--server` or set `OPENHOLE_SERVER_URL`:

```bash
export OPENHOLE_SERVER_URL=wss://tunnel.yourdomain.com/tunnel
openhole 3000
```

### Architecture

```text
┌─────────────────────────────────────────┐
│  VPS                                    │
│  ┌─────────┐                            │
│  │  Caddy  │ :80 / :443                 │
│  └────┬────┘                            │
│       ├── yourdomain.dev  → website:3000 │
│       ├── tunnel.*        → server:8080 │
│       └── *.ophl.link     → server:8080 │
│                                         │
│  openhole-server :8080 (internal only)  │
│  website         :3000 (internal only)│
└─────────────────────────────────────────┘
```

Port `8080` is never published to the host — only Caddy is exposed.

---

## Local development

Run the server and client without Docker:

```bash
# Terminal 1 — server
PUBLIC_TUNNEL_DOMAIN=ophl.link \
TUNNEL_ENDPOINT_HOST=localhost:8080 \
PUBLIC_URL_SCHEME=http \
TRUST_PROXY_HEADERS=false \
go run ./cmd/openhole-server

# Terminal 2 — client
go run ./cmd/openhole 3000 --server ws://localhost:8080/tunnel

# Terminal 3 — test a proxied request
curl -H "Host: <subdomain>.ophl.link" http://localhost:8080/
```

### Website (landing page)

```bash
cd website
npm install
npm run dev
```

### Build binaries

```bash
./scripts/build.sh
```

### Cut a release

```bash
./scripts/release.sh v0.1.0
```

This cross-compiles all platform binaries, generates `dist/checksums.txt`, and prints the `gh release create` command. Always attach `checksums.txt` to GitHub releases so the install script can verify downloads.

Install and uninstall scripts (`openhole.dev/install.sh`, `openhole.dev/uninstall.sh`) are synced from `scripts/` on `npm run build` (website).

---

## Configuration reference

### CLI flags

| Flag | Default | Description |
|------|---------|-------------|
| `port` | — | Local port to expose (required) |
| `--host` | `localhost` | Local host to forward to |
| `--subdomain` | random | Requested subdomain |
| `--server` | see below | WebSocket URL of tunnel server |
| `--verbose` | `false` | Print debug info to stderr |

Server URL resolution order: `--server` → `OPENHOLE_SERVER_URL` → `wss://tunnel.openhole.dev/tunnel`

### Server environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PUBLIC_TUNNEL_DOMAIN` | `ophl.link` | Domain for public tunnel URLs |
| `TUNNEL_ENDPOINT_HOST` | `tunnel.openhole.dev` | Hostname for WebSocket endpoint |
| `SERVER_PORT` | `8080` | HTTP listen port |
| `PUBLIC_URL_SCHEME` | `https` | Scheme in URLs sent to clients |
| `TRUST_PROXY_HEADERS` | `false` | Trust `X-Forwarded-For` from reverse proxy |
| `MAX_BODY_BYTES` | `10485760` | Max request/response body (10 MB) |
| `REQUEST_TIMEOUT_SECONDS` | `30` | Per-request timeout |
| `MAX_CONCURRENT_REQUESTS_PER_TUNNEL` | `25` | Concurrent requests per tunnel |
| `MAX_TUNNELS_PER_IP` | `3` | Active tunnels per IP |
| `MAX_REGISTRATIONS_PER_IP_PER_MINUTE` | `5` | Registration rate limit |
| `MAX_PUBLIC_REQUESTS_PER_IP_PER_MINUTE` | `120` | Public request rate limit |
| `SUBDOMAIN_HOLD_SECONDS` | `30` | Hold period after disconnect |
| `BLOCKED_IPS` | — | Comma-separated blocked IPs |
| `BLOCKED_SUBDOMAINS_EXTRA` | — | Extra reserved subdomain names |

See [`deployments/env.example`](deployments/env.example) for the full template.

---

## Limitations

- **HTTP only** — request/response proxying; WebSocket passthrough through tunnels is not supported yet.
- **10 MB body limit** per request and response.
- **In-memory registry** — all tunnels are lost on server restart.
- **Random subdomains change** on reconnect unless `--subdomain` is used (same IP can reclaim its subdomain within the 30s hold window).
- **No authentication** — tunnel registration is open to anyone who can reach the server.

---

## Launch checklist (operators)

Before going live on your VPS:

1. `cp deployments/env.example deployments/.env` and fill in `CLOUDFLARE_API_TOKEN`
2. Set Cloudflare DNS records (grey cloud / DNS only for `tunnel.*` and `*.ophl.link`)
3. `cd deployments && docker compose up -d --build`
4. Verify: `curl https://tunnel.openhole.dev/health`
5. Cut release: `./scripts/release.sh v0.1.0` → tag → `gh release create` with binaries + `checksums.txt`
6. Test CLI: `openhole 3000` against production
7. Verify install script: `curl -fsSL https://openhole.dev/install.sh | head -5`

See [SECURITY.md](SECURITY.md) for vulnerability and abuse reporting.

---

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, testing, and pull request guidelines.

```bash
go test -race -count=1 ./...
```

---

## License

MIT — see [LICENSE](LICENSE).
