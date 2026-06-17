# Getting started

Get a public HTTPS URL for your local app in under a minute.

## Prerequisites

- A local HTTP server running on some port (e.g. Next.js on `3000`)
- macOS, Linux, or Windows

## 1. Install the CLI

**macOS / Linux:**

```bash
curl -fsSL https://openhole.dev/install.sh | sh
```

**Windows (PowerShell):**

```powershell
irm https://openhole.dev/install.ps1 | iex
```

See [Installation](installation.md) for Homebrew, Scoop, apt, and other methods.

## 2. Start your local app

```bash
npm run dev
# listening on http://localhost:3000
```

## 3. Open the tunnel

```bash
openhole 3000
```

You will see:

```text
OpenHole v0.2.1

✓ Tunnel ready
→ https://blue-fox.ophl.link
→ forwarding to http://localhost:3000

Requests:
GET  /                  200  12ms
```

Share the `https://…ophl.link` URL. Traffic is proxied to your local port over TLS.

## 4. Stop the tunnel

Press `Ctrl+C`. The public URL stops working immediately.

## Next steps

| Goal | Command / doc |
|------|----------------|
| Stable webhook URL | `openhole 3000 --subdomain myapp` — [Usage](usage.md) |
| Multiple ports | `openhole 3000 8080` — [Usage](usage.md) |
| Save defaults | `~/.config/openhole/config.yaml` — [Configuration](configuration.md) |
| HMR / WebSockets | Works out of the box — [WebSocket passthrough](websocket.md) |
| View request logs | `openhole logs -f` — [Commands](commands.md) |
| Self-host | [Self-hosting](self-hosting.md) |

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
3. The server forwards each HTTP request (and WebSocket upgrades) to your CLI.
4. The CLI proxies to your local app and returns the response.

## Check from another terminal

```bash
openhole status
```

Shows version, active tunnels, uptime, and saved subdomains.
