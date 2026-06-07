#!/usr/bin/env bash
set -euo pipefail

REPO="bablilayoub/openhole"
INSTALL_DIR="${INSTALL_DIR:-/usr/local/bin}"

sha256_file() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1" | awk '{print $1}'
  elif command -v shasum >/dev/null 2>&1; then
    shasum -a 256 "$1" | awk '{print $1}'
  else
    echo ""
  fi
}

verify_checksum() {
  local file="$1"
  local binary="$2"
  local checksums_url="$3"

  local checksums
  checksums="$(mktemp)"
  if ! curl -fsSL "$checksums_url" -o "$checksums" 2>/dev/null; then
    rm -f "$checksums"
    echo "Warning: checksums.txt not found — skipping verification"
    return 0
  fi

  local expected
  expected="$(grep -E " ${binary}$" "$checksums" | awk '{print $1}' | head -n1)"
  rm -f "$checksums"

  if [ -z "$expected" ]; then
    echo "Warning: no checksum entry for ${binary} — skipping verification"
    return 0
  fi

  local actual
  actual="$(sha256_file "$file")"
  if [ -z "$actual" ]; then
    echo "Warning: sha256 tool not found — skipping verification"
    return 0
  fi

  if [ "$expected" != "$actual" ]; then
    echo "Checksum mismatch for ${binary}"
    echo "  expected: ${expected}"
    echo "  actual:   ${actual}"
    exit 1
  fi

  echo "✓ Checksum verified"
}

echo "OpenHole install script"
echo ""

if command -v go >/dev/null 2>&1; then
  GO_TAG="@latest"
  if [ -n "${OPENHOLE_VERSION:-}" ] && [ "${OPENHOLE_VERSION}" != "latest" ]; then
    GO_TAG="@${OPENHOLE_VERSION}"
  fi
  echo "Installing via go install${GO_TAG}..."
  go install "github.com/${REPO}/cmd/openhole${GO_TAG}"
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
BINARY="openhole-${OS}-${ARCH}"

if [ "$VERSION" = "latest" ]; then
  BASE_URL="https://github.com/${REPO}/releases/latest/download"
else
  BASE_URL="https://github.com/${REPO}/releases/download/${VERSION}"
fi

URL="${BASE_URL}/${BINARY}"
CHECKSUMS_URL="${BASE_URL}/checksums.txt"

echo "Downloading ${URL}..."
TMP="$(mktemp)"
if ! curl -fsSL "$URL" -o "$TMP"; then
  echo "Release binary not found. Install Go and run:"
  echo "  go install github.com/${REPO}/cmd/openhole@latest"
  exit 1
fi

verify_checksum "$TMP" "$BINARY" "$CHECKSUMS_URL"

chmod +x "$TMP"
if [ -w "$INSTALL_DIR" ]; then
  mv "$TMP" "${INSTALL_DIR}/openhole"
else
  sudo mv "$TMP" "${INSTALL_DIR}/openhole"
fi

echo "✓ Installed to ${INSTALL_DIR}/openhole"
echo "  Run: openhole 3000"
