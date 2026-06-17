#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
VERSION="${VERSION:-$(grep 'const Version' "$ROOT/internal/shared/version.go" | sed 's/.*"\(.*\)".*/\1/')}"
ARCH="${ARCH:-amd64}"

mkdir -p "$ROOT/dist"
BINARY="$ROOT/dist/openhole-linux-${ARCH}"
if [ ! -f "$BINARY" ]; then
  GOOS=linux GOARCH="$ARCH" VERSION="$VERSION" "$ROOT/scripts/build.sh"
fi

NFPM_CFG="$(mktemp)"
cat > "$NFPM_CFG" <<EOF
name: openhole
arch: ${ARCH}
platform: linux
version: ${VERSION}
section: utils
priority: optional
maintainer: OpenHole <https://openhole.dev>
description: Expose localhost to the internet with one command
homepage: https://openhole.dev
license: MIT
contents:
  - src: ${BINARY}
    dst: /usr/local/bin/openhole
    file_info:
      mode: 0755
EOF

nfpm package -f "$NFPM_CFG" -p deb --target "$ROOT/dist"
rm -f "$NFPM_CFG"
echo "Built: $ROOT/dist/openhole_${VERSION}_${ARCH}.deb"
