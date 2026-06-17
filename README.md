# OpenHole

Expose a local HTTP server to the internet with one command. No accounts, no dashboard.

```bash
openhole 3000
```

```text
https://blue-fox.ophl.link  →  http://localhost:3000
```

**Current version:** v0.2.1 · **[Full documentation](docs/README.md)** · **[openhole.dev/docs](https://openhole.dev/docs)**

---

## Features

| Feature | Description |
|---------|-------------|
| One-command tunnels | Public HTTPS URL for any local port |
| WebSocket passthrough | Next.js HMR, Vite, Socket.IO (v0.2.0+) |
| Multi-tunnel | `openhole 3000 8080` — multiple ports, one process |
| Named subdomains | `--subdomain myapp` with reclaim tokens |
| Config file | `~/.config/openhole/config.yaml` |
| Registration tokens | `--token` for self-hosted servers |
| Request logs | `openhole logs -f --json` |
| Cross-platform | macOS, Linux, Windows (amd64 + arm64) |
| Self-hosting | Docker Compose + Caddy + wildcard TLS |

---

## Quick start

```bash
# Install (macOS / Linux)
curl -fsSL https://openhole.dev/install.sh | sh

# Windows (PowerShell)
irm https://openhole.dev/install.ps1 | iex

# Expose port 3000
openhole 3000
```

See [Getting started](docs/getting-started.md) for a full walkthrough.

---

## Documentation

| Guide | Description |
|-------|-------------|
| [docs/README.md](docs/README.md) | Documentation index |
| [Getting started](docs/getting-started.md) | Install and first tunnel |
| [Installation](docs/installation.md) | All install methods |
| [CLI usage](docs/usage.md) | Ports, config, tokens, multi-tunnel |
| [Commands](docs/commands.md) | `status`, `logs`, `update`, flags |
| [WebSocket passthrough](docs/websocket.md) | HMR and real-time apps |
| [Configuration](docs/configuration.md) | Flags, env, `config.yaml`, server vars |
| [Self-hosting](docs/self-hosting.md) | Docker, DNS, registration tokens |
| [Security](docs/security.md) | Threat model and limits |
| [Package managers](docs/package-managers.md) | Homebrew, Scoop, apt |

Website: **[openhole.dev/docs](https://openhole.dev/docs)**

---

## Usage examples

```bash
openhole 3000                              # random subdomain
openhole 3000 --subdomain myapp            # stable URL
openhole 3000 8080                         # multiple ports
openhole 3000 --token secret               # protected server
openhole status                            # active tunnels
openhole logs -f                           # follow request log
openhole update                            # self-update
```

Config file (`~/.config/openhole/config.yaml`):

```yaml
server: wss://tunnel.myteam.dev/tunnel
host: localhost
subdomain: myapp
token: your-secret
```

---

## How it works

```text
Internet → Caddy (TLS) → openhole-server ←WebSocket→ openhole CLI → localhost:PORT
```

1. CLI registers a subdomain over WebSocket.
2. HTTPS traffic hits `https://<subdomain>.<domain>`.
3. Server forwards HTTP requests and WebSocket upgrades to your CLI.
4. CLI proxies to your local app.

---

## Self-hosting

```bash
cd deployments && cp env.example .env
# Set CLOUDFLARE_API_TOKEN, domains, etc.
docker compose up -d --build
```

```bash
export OPENHOLE_SERVER_URL=wss://tunnel.yourdomain.com/tunnel
openhole 3000 --token your-secret   # if REGISTRATION_TOKENS is set
```

Full guide: [docs/self-hosting.md](docs/self-hosting.md)

---

## Development

```bash
go test -race -count=1 ./...
./scripts/build.sh
./scripts/release.sh v0.2.1
```

Website:

```bash
cd website && npm install && npm run dev
```

See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md).

---

## License

MIT — see [LICENSE](LICENSE).
