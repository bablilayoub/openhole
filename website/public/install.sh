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

install_binary() {
  local src="$1"
  if [ ! -f "$src" ]; then
    echo "Error: binary not found at ${src}"
    exit 1
  fi
  if [ -w "$INSTALL_DIR" ]; then
    install -m 755 "$src" "${INSTALL_DIR}/openhole"
  else
    sudo install -m 755 "$src" "${INSTALL_DIR}/openhole"
  fi
  echo "✓ Installed to ${INSTALL_DIR}/openhole"
  echo "  Run: openhole 3000"
}

echo "OpenHole install script"
echo ""

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
  mingw*|msys*|cygwin*|windows*) OS="windows" ;;
  *) echo "Unsupported OS: $OS (use install.ps1 on Windows)"; exit 1 ;;
esac

if [ "$OS" = "windows" ]; then
  echo "On Windows, use PowerShell:"
  echo "  irm https://openhole.dev/install.ps1 | iex"
  exit 1
fi

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
  echo "Release binary not found. Check OPENHOLE_VERSION or GitHub releases:"
  echo "  https://github.com/${REPO}/releases"
  exit 1
fi

verify_checksum "$TMP" "$BINARY" "$CHECKSUMS_URL"

install_binary "$TMP"
rm -f "$TMP"
