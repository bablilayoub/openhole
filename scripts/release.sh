#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:-}"
if [ -z "$VERSION" ]; then
  echo "Usage: ./scripts/release.sh v0.1.0"
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export VERSION="${VERSION#v}"

for os in darwin linux windows; do
  for arch in amd64 arm64; do
    GOOS=$os GOARCH=$arch VERSION="$VERSION" ./scripts/build.sh
  done
done

cd dist
if command -v sha256sum >/dev/null 2>&1; then
  sha256sum openhole-* > checksums.txt
elif command -v shasum >/dev/null 2>&1; then
  shasum -a 256 openhole-* | sed 's/ \*/  /' > checksums.txt
else
  echo "Error: sha256sum or shasum required to generate checksums.txt"
  exit 1
fi
cd "$ROOT"

echo ""
echo "Release artifacts in dist/:"
ls -la dist/
echo ""
echo "checksums.txt:"
cat dist/checksums.txt
echo ""
echo "Tag and push release on GitHub:"
echo "  git tag ${VERSION} && git push origin ${VERSION}"
echo "  gh release create ${VERSION} dist/openhole-* dist/checksums.txt --title ${VERSION}"
