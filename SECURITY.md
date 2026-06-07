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

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | Yes       |
