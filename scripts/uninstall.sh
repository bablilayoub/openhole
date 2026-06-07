#!/usr/bin/env bash
set -euo pipefail

INSTALL_DIR="${INSTALL_DIR:-/usr/local/bin}"

go_install_path() {
  if ! command -v go >/dev/null 2>&1; then
    return
  fi
  local gobin
  gobin="$(go env GOBIN 2>/dev/null || true)"
  if [ -n "$gobin" ]; then
    echo "${gobin}/openhole"
    return
  fi
  echo "$(go env GOPATH 2>/dev/null)/bin/openhole"
}

remove_binary() {
  local path="$1"
  [ -n "$path" ] || return 1
  [ -f "$path" ] || return 1

  local dir
  dir="$(dirname "$path")"
  if [ -w "$dir" ]; then
    rm -f "$path"
  else
    sudo rm -f "$path"
  fi
  echo "✓ Removed ${path}"
}

if command -v openhole >/dev/null 2>&1; then
  exec openhole uninstall
fi

echo "OpenHole uninstall"
echo ""

removed=0
seen="|"

add_candidate() {
  local path="$1"
  [ -n "$path" ] || return
  case "$seen" in
    *"|${path}|"*) return ;;
  esac
  seen="${seen}${path}|"
  if remove_binary "$path"; then
    removed=1
  fi
}

add_candidate "${INSTALL_DIR}/openhole"
add_candidate "${HOME}/.local/bin/openhole"
add_candidate "$(go_install_path)"
add_candidate "$(command -v openhole 2>/dev/null || true)"

if [ "$removed" -eq 0 ]; then
  echo "openhole not found — nothing to remove"
  echo ""
  echo "Checked:"
  echo "  ${INSTALL_DIR}/openhole"
  echo "  ${HOME}/.local/bin/openhole"
  if command -v go >/dev/null 2>&1; then
    echo "  $(go_install_path)"
  fi
  exit 0
fi

echo ""
echo "Done. OpenHole has been uninstalled."
