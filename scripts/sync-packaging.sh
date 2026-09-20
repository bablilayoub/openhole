#!/usr/bin/env bash
# Fill packaging/homebrew/openhole.rb and packaging/scoop/openhole.json with the
# version, URLs and sha256s from a checksums.txt.
#
#   ./scripts/sync-packaging.sh v0.3.0              # from the published GitHub release
#   ./scripts/sync-packaging.sh dist/checksums.txt   # from a local build (VERSION env)
#
# The published release is the source of truth: users download those bytes, so
# the packaging files must carry those hashes, not a local build's.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

ARG="${1:-}"
if [ -z "$ARG" ]; then
  echo "Usage: $0 vX.Y.Z | path/to/checksums.txt" >&2
  exit 1
fi

if [ -f "$ARG" ]; then
  SUMS="$ARG"
  VERSION="${VERSION:-$(grep 'const Version' internal/shared/version.go | sed 's/.*"\(.*\)".*/\1/')}"
else
  VERSION="${ARG#v}"
  SUMS="$(mktemp)"
  curl -fsSL "https://github.com/bablilayoub/openhole/releases/download/v${VERSION}/checksums.txt" -o "$SUMS"
fi

sha_for() {
  local sha
  sha="$(awk -v f="openhole-$1" '$2 == f { print $1 }' "$SUMS")"
  if [ -z "$sha" ]; then
    echo "sync-packaging: no checksum for openhole-$1 in $SUMS" >&2
    exit 1
  fi
  printf '%s' "$sha"
}

tmp="$(mktemp)"
awk -v ver="$VERSION" \
    -v dam="$(sha_for darwin-amd64)" -v darm="$(sha_for darwin-arm64)" \
    -v lam="$(sha_for linux-amd64)"  -v larm="$(sha_for linux-arm64)" '
  /^  version "/          { sub(/"[^"]*"/, "\"" ver "\"") }
  /url .*darwin-amd64/    { cur = dam }
  /url .*darwin-arm64/    { cur = darm }
  /url .*linux-amd64/     { cur = lam }
  /url .*linux-arm64/     { cur = larm }
  /sha256 "/ && cur != "" { sub(/sha256 "[^"]*"/, "sha256 \"" cur "\""); cur = "" }
  { print }
' packaging/homebrew/openhole.rb > "$tmp" && mv "$tmp" packaging/homebrew/openhole.rb

tmp="$(mktemp)"
awk -v ver="$VERSION" \
    -v wam="$(sha_for windows-amd64.exe)" -v warm="$(sha_for windows-arm64.exe)" '
  /"version":/ { sub(/"[0-9][^"]*"/, "\"" ver "\"") }
  /"url": .*\/v[0-9][^"]*\/openhole-windows-amd64/ { sub(/v[0-9][^\/]*\//, "v" ver "/"); cur = wam }
  /"url": .*\/v[0-9][^"]*\/openhole-windows-arm64/ { sub(/v[0-9][^\/]*\//, "v" ver "/"); cur = warm }
  /"hash":/ && cur != "" { sub(/"hash": "[^"]*"/, "\"hash\": \"" cur "\""); cur = "" }
  { print }
' packaging/scoop/openhole.json > "$tmp" && mv "$tmp" packaging/scoop/openhole.json

echo "packaging synced to v${VERSION} from ${SUMS}"
