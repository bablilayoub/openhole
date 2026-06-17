# CLI usage

## Basic tunnel

```bash
openhole 3000
```

Assigns a random subdomain (e.g. `blue-fox.ophl.link`) and forwards public HTTPS traffic to `http://localhost:3000`.

## Multiple ports

Expose more than one local port in a single process:

```bash
openhole 3000 8080
```

Each port gets its own tunnel and auto-assigned subdomain. `--subdomain` is not allowed with multiple ports.

## Named subdomain

```bash
openhole 3000 --subdomain myapp
# → https://myapp.ophl.link
```

Named subdomains are held for a short period after disconnect. The CLI stores a **reclaim token** in `~/.config/openhole/reclaim.json` so you can reconnect (even from a new IP) within the hold window.

## Local host

Default is `localhost`. Forward to another host on your machine:

```bash
openhole 3000 --host 127.0.0.1
openhole 3000 --host host.docker.internal
```

## Custom tunnel server

For self-hosted infrastructure:

```bash
openhole 3000 --server wss://tunnel.example.com/tunnel
```

Or via environment variable:

```bash
export OPENHOLE_SERVER_URL=wss://tunnel.example.com/tunnel
openhole 3000
```

## Registration token

When the server requires authentication (see [Self-hosting](self-hosting.md)):

```bash
openhole 3000 --token your-secret
# or
export OPENHOLE_TOKEN=your-secret
openhole 3000
```

## Config file

Save defaults in `~/.config/openhole/config.yaml`:

```yaml
server: wss://tunnel.myteam.dev/tunnel
host: localhost
subdomain: myapp
token: your-secret
verbose: false
```

Override the path:

```bash
openhole 3000 --config /path/to/config.yaml
```

Precedence: **defaults → config file → environment → CLI flags**. See [Configuration](configuration.md).

## Verbose mode

```bash
openhole 3000 --verbose
```

Prints server URL, host, and port to stderr. Local proxy errors include the underlying error message.

## Reconnection

If the WebSocket drops, the CLI reconnects automatically with exponential backoff (2s → 30s cap).

- **Random subdomain:** the public URL may change on reconnect — OpenHole prints a warning.
- **Named subdomain:** use the reclaim token to keep the same name.

## Terminal output

```text
OpenHole v0.2.1

✓ Tunnel ready
→ https://myapp.ophl.link
→ forwarding to http://localhost:3000

Requests:
GET  /api/users          200  12ms
WS   /_next/webpack-hmr  101  0ms
POST /webhooks/stripe    201  45ms
```

Request lines are also written to `~/.config/openhole/requests.jsonl` for `openhole logs`.

## Data stored locally

| File | Purpose |
|------|---------|
| `~/.config/openhole/config.yaml` | User defaults (optional) |
| `~/.config/openhole/sessions.json` | Active tunnel metadata |
| `~/.config/openhole/reclaim.json` | Subdomain reclaim tokens |
| `~/.config/openhole/requests.jsonl` | Request log (ring buffer, 1000 lines) |

Override the config directory with `OPENHOLE_CONFIG_DIR`.
