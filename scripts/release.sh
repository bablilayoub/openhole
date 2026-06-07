#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:-}"
if [ -z "$VERSION" ]; then
  echo "Usage: ./scripts/release.sh v0.1.0"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

for os in darwin linux; do
  for arch in amd64 arm64; do
    GOOS=$os GOARCH=$arch ./scripts/build.sh
  done
done

echo ""
echo "Tag and push release on GitHub:"
echo "  git tag $VERSION && git push origin $VERSION"
echo "  gh release create $VERSION dist/openhole-* --title $VERSION"
