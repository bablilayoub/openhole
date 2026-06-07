# OpenHole

Open localhost to the internet in one command.

OpenHole is a fast, clean, no-login tunnel for developers.

```bash
openhole 3000
```

```text
https://blue-fox.ophl.link → http://localhost:3000
```

## Quick start

```bash
# Install
go install github.com/bablilayoub/openhole/cmd/openhole@latest

# Start a tunnel
openhole 3000
```

Or:

```bash
curl -fsSL https://openhole.dev/install.sh | sh
```

## Usage

```bash
openhole 3000
openhole 3000 --subdomain myapp
openhole 3000 --host 127.0.0.1
openhole 3000 --server ws://localhost:8080/tunnel   # local dev
openhole --version
```

## Security

OpenHole exposes your local service to the public internet. Anyone with the URL can access it.

Do not expose admin panels, databases, or sensitive services unless you know what you are doing.

Acceptable use: [openhole.dev/terms](https://openhole.dev/terms) · Report abuse: abuse@openhole.dev

## Self-hosting

### Requirements

- VPS with Docker and Docker Compose
- Domains: `openhole.dev` (product) and `ophl.link` (tunnels)
- Cloudflare DNS with API token (DNS-01 wildcard TLS)

### Deploy

```bash
cd deployments
cp env.example .env
# Fill in CLOUDFLARE_API_TOKEN and other values

docker compose up -d --build
```

Verify:

```bash
curl https://tunnel.openhole.dev/health
```

### DNS (Cloudflare)

| Zone | Record | Target | Proxy |
|------|--------|--------|-------|
| openhole.dev | A `@`, `www` | VPS IP | Optional |
| openhole.dev | A `tunnel` | VPS IP | DNS only |
| ophl.link | A `@`, `*` | VPS IP | DNS only |

## Development

```bash
# Server
PUBLIC_TUNNEL_DOMAIN=ophl.link TUNNEL_ENDPOINT_HOST=localhost:8080 PUBLIC_URL_SCHEME=http \
  go run ./cmd/openhole-server

# Client
go run ./cmd/openhole 3000 --server ws://localhost:8080/tunnel

# Test proxy
curl -H "Host: <subdomain>.ophl.link" http://localhost:8080/
```

Build binaries:

```bash
./scripts/build.sh
```

## Limitations (MVP)

- HTTP request/response only (no app WebSocket forwarding yet)
- 10MB body limit per request/response
- In-memory tunnel registry (tunnels lost on server restart)
- Random subdomains change on reconnect

## License

MIT — see [LICENSE](LICENSE).
