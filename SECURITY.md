# Security Policy

## Reporting a Vulnerability

If you discover a security issue in OpenHole, please report it privately:

- **Email:** security@openhole.dev (or abuse@openhole.dev if unavailable)

Do not open public GitHub issues for undisclosed vulnerabilities.

We aim to acknowledge reports within 48 hours.

## Reporting Abuse

OpenHole tunnels can expose local services to the public internet. To report phishing, malware, or other abuse served through `*.ophl.link`:

- **Email:** abuse@openhole.dev
- **Policy:** https://openhole.dev/terms

## Scope

| In scope | Out of scope |
|----------|----------------|
| `openhole-server` tunnel/proxy logic | Misconfiguration of your own self-hosted instance |
| `openhole` CLI | Vulnerabilities in your local application behind a tunnel |
| `openhole.dev` / `ophl.link` infrastructure | Social engineering |
| Official Docker deployment configs | Third-party dependencies (report upstream) |

## Deployment requirements

- **Never expose `openhole-server` port 8080 directly to the internet** with `TRUST_PROXY_HEADERS=true`. Place Caddy (or another trusted reverse proxy) in front so it overwrites `X-Forwarded-For`. Otherwise clients can spoof IP-based rate limits and subdomain hold reclaim.
- **Always use `wss://`** for the CLI tunnel endpoint in production. Reclaim tokens are secrets; `ws://` sends them in cleartext.
- **Do not run tunnels with `--verbose`** against production services — backend error details are forwarded to public requesters.

## Known limitations (not bugs)

- Tunnel registration is intentionally unauthenticated on the public free tier.
- Named subdomains can be reclaimed during the hold window by the same egress IP without a reclaim token (NAT/shared-IP environments).
- Per-IP rate limits do not stop distributed abuse across many source IPs.

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | Yes       |
