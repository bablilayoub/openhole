#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ENV_FILE="$ROOT/deployments/.env"

echo "OpenHole server migration"
echo ""

if [ ! -f "$ENV_FILE" ]; then
  echo "Error: deployments/.env not found."
  echo "  cp deployments/env.example deployments/.env"
  exit 1
fi

echo "==> Pulling latest main..."
git pull --ff-only origin main

if ! grep -qE '^NEXT_PUBLIC_SITE_URL=' "$ENV_FILE"; then
  site_url="$(grep '^NEXT_PUBLIC_SITE_URL=' deployments/env.example | cut -d= -f2-)"
  echo "NEXT_PUBLIC_SITE_URL=${site_url}" >> "$ENV_FILE"
  echo "==> Added NEXT_PUBLIC_SITE_URL to deployments/.env"
fi

echo "==> Rebuilding services..."
cd "$ROOT/deployments"
docker compose up -d --build

echo ""
echo "==> Service status"
docker compose ps

echo ""
echo "==> Waiting for healthchecks (20s)..."
sleep 20
docker compose ps

failed=0

if docker compose exec -T openhole-server wget -qO- http://localhost:8080/health 2>/dev/null | grep -q '"status":"ok"'; then
  echo "✓ openhole-server healthy"
else
  echo "✗ openhole-server unhealthy — docker compose logs openhole-server"
  failed=1
fi

if docker compose exec -T website wget -qO- http://127.0.0.1:3000/ >/dev/null 2>&1; then
  echo "✓ website healthy"
else
  echo "✗ website unhealthy — docker compose logs website"
  failed=1
fi

tunnel_host="$(grep '^TUNNEL_ENDPOINT_HOST=' "$ENV_FILE" | cut -d= -f2- | tr -d '"' || true)"
site_url="$(grep '^NEXT_PUBLIC_SITE_URL=' "$ENV_FILE" | cut -d= -f2- | tr -d '"' || true)"

echo ""
if [ "$failed" -eq 0 ]; then
  echo "Migration complete."
else
  echo "Migration finished with errors."
fi

echo ""
echo "Verify externally:"
if [ -n "$site_url" ]; then
  echo "  curl -fsSL ${site_url}/install.sh | head -3"
fi
if [ -n "$tunnel_host" ]; then
  echo "  curl https://${tunnel_host}/health"
fi

exit "$failed"
