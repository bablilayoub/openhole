#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

mkdir -p dist
GOOS="${GOOS:-$(go env GOOS)}"
GOARCH="${GOARCH:-$(go env GOARCH)}"

echo "Building openhole CLI (${GOOS}/${GOARCH})..."
CGO_ENABLED=0 go build -ldflags="-s -w" -o "dist/openhole-${GOOS}-${GOARCH}" ./cmd/openhole

echo "Building openhole-server (${GOOS}/${GOARCH})..."
CGO_ENABLED=0 go build -ldflags="-s -w" -o "dist/openhole-server-${GOOS}-${GOARCH}" ./cmd/openhole-server

echo "Done. Binaries in dist/"
