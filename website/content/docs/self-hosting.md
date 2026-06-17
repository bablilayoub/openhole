# Self-hosting

Run your own tunnel infrastructure with Docker Compose, Caddy, and wildcard TLS.

## Prerequisites

| Requirement | Notes |
|-------------|-------|
| VPS | Docker + Docker Compose |
| Marketing domain | e.g. `openhole.dev` |
| Tunnel domain | e.g. `ophl.link` |
| Cloudflare account | DNS-01 wildcard TLS for `*.ophl.link` |
| Cloudflare API token | Zone → DNS → Edit on both zones |

## 1. Configure environment

```bash
cd deployments
cp env.example .env
```

Minimum required settings:

```bash
CLOUDFLARE_API_TOKEN=your_token_here
CADDY_ACME_EMAIL=admin@yourdomain.com
PUBLIC_TUNNEL_DOMAIN=ophl.link
TUNNEL_ENDPOINT_HOST=tunnel.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.dev
NEXT_PUBLIC_TUNNEL_DOMAIN=ophl.link
TRUST_PROXY_HEADERS=true
```

### Optional: require registration tokens

Protect your server from random tunnel registration:

```bash
REGISTRATION_TOKENS=team-secret,another-token
```

Clients must then use:

```bash
openhole 3000 --server wss://tunnel.yourdomain.com/tunnel --token team-secret
```

Or set `token` in `~/.config/openhole/config.yaml`.

> `TRUST_PROXY_HEADERS=true` is required in Docker (Caddy sits in front). Never expose port `8080` directly to the internet with this enabled — clients could spoof their IP.

## 2. DNS records (Cloudflare)

| Zone | Record | Target | Proxy |
|------|--------|--------|-------|
| `yourdomain.dev` | A `@` | VPS IP | DNS only recommended |
| `yourdomain.dev` | A `www` | VPS IP | DNS only recommended |
| `yourdomain.dev` | A `tunnel` | VPS IP | **DNS only** (required) |
| `ophl.link` | A `@` | VPS IP | **DNS only** (required) |
| `ophl.link` | A `*` | VPS IP | **DNS only** (required) |

Orange-cloud (proxied) records on `tunnel.*` or `*.ophl.link` break tunnel routing.

## 3. Deploy

```bash
docker compose up -d --build
```

Verify health:

```bash
curl https://tunnel.yourdomain.com/health
# {"status":"ok"}
```

## 4. Connect the CLI

```bash
export OPENHOLE_SERVER_URL=wss://tunnel.yourdomain.com/tunnel
openhole 3000 --token team-secret   # if REGISTRATION_TOKENS is set
```

## Architecture

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
│  website         :3000 (internal only)  │
└─────────────────────────────────────────┘
```

Port `8080` is never published to the host — only Caddy is exposed.

## Services

| Service | Role |
|---------|------|
| **caddy** | TLS termination, routing, Let's Encrypt via Cloudflare DNS-01 |
| **openhole-server** | Tunnel registry, HTTP/WS proxy |
| **website** | Landing page and docs |

## Local development (no Docker)

```bash
# Terminal 1 — server
PUBLIC_TUNNEL_DOMAIN=ophl.link \
TUNNEL_ENDPOINT_HOST=localhost:8080 \
PUBLIC_URL_SCHEME=http \
TRUST_PROXY_HEADERS=false \
go run ./cmd/openhole-server

# Terminal 2 — client
go run ./cmd/openhole 3000 --server ws://localhost:8080/tunnel

# Terminal 3 — test
curl -H "Host: <subdomain>.ophl.link" http://localhost:8080/
```

## Release binaries

Self-hosters can download `openhole-server-*` from [GitHub Releases](https://github.com/bablilayoub/openhole/releases) or build with:

```bash
./scripts/build.sh
```

## Operator checklist

1. Fill in `.env` including `CLOUDFLARE_API_TOKEN`
2. Set DNS records (grey cloud for `tunnel.*` and `*.ophl.link`)
3. `docker compose up -d --build`
4. `curl https://tunnel.yourdomain.com/health`
5. Test CLI against your server
6. Set `REGISTRATION_TOKENS` if the server is on the public internet

See [Security](security.md) for abuse handling and [Configuration](configuration.md) for all server variables.
