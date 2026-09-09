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

# Fill the Homebrew formula and Scoop manifest from checksums.txt so they are
# installable as committed, not templates.
sha_for() { awk -v f="openhole-$1" '$2 == f { print $1 }' dist/checksums.txt; }
rewrite() { local tmp; tmp="$(mktemp)"; awk "$1" "$2" > "$tmp" && mv "$tmp" "$2"; }

rewrite "
  /^  version \"/ { sub(/\"[^\"]*\"/, \"\\\"${VERSION}\\\"\") }
  /url .*darwin-amd64/ { cur = \"$(sha_for darwin-amd64)\" }
  /url .*darwin-arm64/ { cur = \"$(sha_for darwin-arm64)\" }
  /url .*linux-amd64/  { cur = \"$(sha_for linux-amd64)\" }
  /url .*linux-arm64/  { cur = \"$(sha_for linux-arm64)\" }
  /sha256 \"/ && cur != \"\" { sub(/sha256 \"[^\"]*\"/, \"sha256 \\\"\" cur \"\\\"\"); cur = \"\" }
  { print }
" packaging/homebrew/openhole.rb

rewrite "
  /\"version\":/ { sub(/\"[0-9][^\"]*\"/, \"\\\"${VERSION}\\\"\") }
  /\"url\": .*v[0-9][^\"]*\/openhole-windows-amd64/ { sub(/v[0-9][^\/]*\//, \"v${VERSION}/\"); cur = \"$(sha_for windows-amd64.exe)\" }
  /\"url\": .*v[0-9][^\"]*\/openhole-windows-arm64/ { sub(/v[0-9][^\/]*\//, \"v${VERSION}/\"); cur = \"$(sha_for windows-arm64.exe)\" }
  /\"hash\":/ && cur != \"\" { sub(/\"hash\": \"[^\"]*\"/, \"\\\"hash\\\": \\\"\" cur \"\\\"\"); cur = \"\" }
  { print }
" packaging/scoop/openhole.json

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
echo ""
echo "packaging/homebrew/openhole.rb and packaging/scoop/openhole.json now carry the v${VERSION} hashes — commit them."
