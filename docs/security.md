# Security

**OpenHole exposes your local service to the public internet.** Anyone with the URL can access it.

## Threat model

| Risk | Mitigation |
|------|------------|
| Public access to local app | Only tunnel what you would publish; use dev/staging data |
| Open registration on public server | Public `ophl.link` is open by design — use self-host + tokens for teams |
| Subdomain squatting | Use `REGISTRATION_TOKENS` on self-hosted servers |
| Abuse / phishing | Reserved subdomains, rate limits, abuse reporting |
| IP spoofing behind proxy | Only enable `TRUST_PROXY_HEADERS` behind a trusted reverse proxy |
| Large payloads | 10 MB body limit per request/response |
| Protocol abuse | Message size limits, header validation, CRLF injection checks |

## Do not tunnel

- Admin panels without authentication
- Databases or debug endpoints
- `.env` files or source trees
- Internal APIs you would not expose in production

## Built-in protections

| Protection | Default |
|------------|---------|
| HTTPS (TLS) | Automatic via Caddy on public infrastructure |
| Body size limit | 10 MB per request/response |
| WebSocket frame limit | 1 MiB per frame |
| WebSocket streams | 10 concurrent per tunnel |
| Rate limits | Per-IP registration and request limits |
| Blocked subdomains | Reserved names (`admin`, `api`, `www`, …) |
| Header sanitization | Spoofed `X-Forwarded-*` stripped before your app |
| Client concurrency | 25 concurrent local HTTP requests per tunnel |
| Protocol validation | Message size, header count, CRLF limits |

## Registration tokens

For self-hosted servers, set `REGISTRATION_TOKENS` to require a shared secret at registration time. This does not add per-request auth — it only controls who can open a tunnel.

```bash
# Server
REGISTRATION_TOKENS=long-random-secret

# Client
openhole 3000 --token long-random-secret
```

## Reclaim tokens

Named subdomains use reclaim tokens (64-char hex) stored locally in `~/.config/openhole/reclaim.json`. These let you reconnect to the same subdomain during the hold window — they are not API keys for HTTP traffic.

## Reporting abuse

- **Email:** [abuse@openhole.dev](mailto:abuse@openhole.dev)
- **Policy:** [openhole.dev/terms](https://openhole.dev/terms)
- **Vulnerabilities:** see [SECURITY.md](https://github.com/bablilayoub/openhole/blob/main/SECURITY.md) in the repository

## Acceptable use

OpenHole is for development, testing, and demonstrations. Phishing, malware, spam, and impersonation are prohibited. Violating tunnels may be terminated without notice.
