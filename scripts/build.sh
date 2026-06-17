#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

VERSION="${VERSION:-$(grep 'const Version' internal/shared/version.go | sed 's/.*"\(.*\)".*/\1/')}"
LDFLAGS="-s -w -X github.com/bablilayoub/openhole/internal/shared.Version=${VERSION}"

mkdir -p dist
GOOS="${GOOS:-$(go env GOOS)}"
GOARCH="${GOARCH:-$(go env GOARCH)}"

SUFFIX=""
if [ "$GOOS" = "windows" ]; then
  SUFFIX=".exe"
fi

echo "Building openhole CLI (${GOOS}/${GOARCH}) v${VERSION}..."
CGO_ENABLED=0 go build -ldflags="${LDFLAGS}" -o "dist/openhole-${GOOS}-${GOARCH}${SUFFIX}" ./cmd/openhole

echo "Building openhole-server (${GOOS}/${GOARCH}) v${VERSION}..."
CGO_ENABLED=0 go build -ldflags="${LDFLAGS}" -o "dist/openhole-server-${GOOS}-${GOARCH}${SUFFIX}" ./cmd/openhole-server

echo "Done. Binaries in dist/"
