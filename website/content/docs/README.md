# OpenHole Documentation

OpenHole exposes a local HTTP server to the internet with one command. No accounts, no dashboard, no API keys required for the public service.

```bash
openhole 3000
# → https://blue-fox.ophl.link  →  http://localhost:3000
```

**Current version:** v0.2.1

---

## Guides

| Guide | Description |
|-------|-------------|
| [Getting started](getting-started.md) | Install, first tunnel, what you see in the terminal |
| [Installation](installation.md) | macOS, Linux, Windows, Homebrew, Scoop, apt, build from source |
| [CLI usage](usage.md) | Ports, subdomains, multi-tunnel, config file, tokens |
| [Commands](commands.md) | `status`, `update`, `logs`, `uninstall` |
| [WebSocket passthrough](websocket.md) | HMR, live reload, Socket.IO through the tunnel |
| [Configuration](configuration.md) | Flags, env vars, `config.yaml`, precedence |
| [Self-hosting](self-hosting.md) | Docker, DNS, Caddy, registration tokens |
| [Security](security.md) | Threat model, limits, abuse reporting |
| [Package managers](package-managers.md) | Homebrew, Scoop, Debian packages |

---

## Feature overview

| Feature | Description |
|---------|-------------|
| **One-command tunnels** | `openhole 3000` gives you a public HTTPS URL |
| **WebSocket passthrough** | HTTP upgrades relayed for Next.js HMR, Vite, Socket.IO (v0.2.0+) |
| **Multi-tunnel** | `openhole 3000 8080` — multiple ports in one process (v0.2.1+) |
| **Named subdomains** | `--subdomain myapp` with reclaim tokens across reconnects |
| **Config file** | `~/.config/openhole/config.yaml` for defaults (v0.2.1+) |
| **Registration tokens** | Optional `--token` / `REGISTRATION_TOKENS` for self-hosted servers |
| **Request logs** | `openhole logs -f` with `--json` for scripting |
| **Cross-platform** | macOS, Linux, Windows (amd64 + arm64) |
| **Self-update** | `openhole update` downloads verified releases |
| **Self-hosting** | Full Docker Compose stack with Caddy + wildcard TLS |

---

## Quick reference

```bash
# Basic
openhole 3000
openhole 3000 --subdomain myapp
openhole 3000 8080                    # multiple ports

# Self-hosted server
openhole 3000 --server wss://tunnel.example.com/tunnel --token secret

# Config & status
openhole status
openhole logs -f
openhole update

# Version
openhole --version
```

---

## Support

- **GitHub:** [github.com/bablilayoub/openhole](https://github.com/bablilayoub/openhole)
- **Issues:** [github.com/bablilayoub/openhole/issues](https://github.com/bablilayoub/openhole/issues)
- **Abuse:** [abuse@openhole.dev](mailto:abuse@openhole.dev)
- **Terms:** [openhole.dev/terms](https://openhole.dev/terms)

## License

MIT — see [LICENSE](https://github.com/bablilayoub/openhole/blob/main/LICENSE).
