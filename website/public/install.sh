#!/usr/bin/env bash
set -euo pipefail

REPO="bablilayoub/openhole"
INSTALL_DIR="${INSTALL_DIR:-/usr/local/bin}"

echo "OpenHole install script"
echo ""

if command -v go >/dev/null 2>&1; then
  echo "Installing via go install..."
  go install "github.com/${REPO}/cmd/openhole@latest"
  echo ""
  echo "✓ Installed. Run: openhole 3000"
  exit 0
fi

OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
ARCH="$(uname -m)"
case "$ARCH" in
  x86_64) ARCH="amd64" ;;
  aarch64|arm64) ARCH="arm64" ;;
  *) echo "Unsupported architecture: $ARCH"; exit 1 ;;
esac
case "$OS" in
  darwin) OS="darwin" ;;
  linux) OS="linux" ;;
  *) echo "Unsupported OS: $OS"; exit 1 ;;
esac

VERSION="${OPENHOLE_VERSION:-latest}"
URL="https://github.com/${REPO}/releases/${VERSION}/download/openhole-${OS}-${ARCH}"

echo "Downloading ${URL}..."
TMP="$(mktemp)"
if ! curl -fsSL "$URL" -o "$TMP"; then
  echo "Release binary not found. Install Go and run:"
  echo "  go install github.com/${REPO}/cmd/openhole@latest"
  exit 1
fi

chmod +x "$TMP"
if [ -w "$INSTALL_DIR" ]; then
  mv "$TMP" "${INSTALL_DIR}/openhole"
else
  sudo mv "$TMP" "${INSTALL_DIR}/openhole"
fi

echo "✓ Installed to ${INSTALL_DIR}/openhole"
echo "  Run: openhole 3000"
