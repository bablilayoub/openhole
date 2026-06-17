# WebSocket passthrough

**Shipped in v0.2.0**

OpenHole relays HTTP `Upgrade: websocket` requests through the tunnel so real-time dev tools work without extra configuration.

## What works

| Tool | Use case |
|------|----------|
| **Next.js** | Fast Refresh / HMR (`/_next/webpack-hmr`) |
| **Vite** | Hot module replacement |
| **Socket.IO** | Real-time bidirectional events |
| **Any WebSocket server** | Standard HTTP upgrade on your local port |

Start your dev server and tunnel as usual:

```bash
npm run dev
openhole 3000
```

Open the public URL in a browser — HMR and WebSocket connections route through the tunnel automatically.

## How it works

1. A browser sends `GET` with `Upgrade: websocket` to `https://myapp.ophl.link`.
2. The tunnel server detects the upgrade and sends a `ws_open` message to the CLI.
3. The CLI dials your local WebSocket endpoint (same path and headers).
4. Frames are relayed bidirectionally over the control WebSocket using binary `OHWS` framing.

HTTP requests continue to use the existing JSON request/response protocol.

## Limits

| Resource | Limit |
|----------|-------|
| Concurrent WebSocket streams | 10 per tunnel |
| Max frame size | 1 MiB |
| HTTP body (non-WS) | 10 MB per request/response |

## Terminal output

WebSocket upgrades appear in the request log:

```text
WS   /_next/webpack-hmr  101  0ms
```

Use `openhole logs -f` to watch upgrades in another terminal.

## Troubleshooting

| Symptom | Check |
|---------|-------|
| HMR not connecting | Ensure the local app listens on the tunneled port; try `--verbose` |
| Connection drops | WebSocket streams close when the CLI disconnects — it will reconnect |
| 502 on upgrade | Local WebSocket server not running or wrong path |

For local-only debugging without a tunnel, connect directly to `localhost`.
