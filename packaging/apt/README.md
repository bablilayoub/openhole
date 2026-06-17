# Apt / Debian packaging

OpenHole does not maintain an official apt repository yet. Options:

## Option 1: Install script (recommended)

```bash
curl -fsSL https://openhole.dev/install.sh | sh
```

## Option 2: Download release binary

```bash
VERSION=v0.2.0
ARCH=amd64   # or arm64
curl -fsSL -o /usr/local/bin/openhole \
  "https://github.com/bablilayoub/openhole/releases/download/${VERSION}/openhole-linux-${ARCH}"
chmod +x /usr/local/bin/openhole
```

Verify with `checksums.txt` from the same release.

## Option 3: Build a .deb with nfpm

```bash
# Install nfpm: https://nfpm.goreleaser.com/
VERSION=0.2.0 ARCH=amd64 ./packaging/apt/build-deb.sh
sudo dpkg -i dist/openhole_${VERSION}_amd64.deb
```

## Option 4: Homebrew on Linux

```bash
brew install ./packaging/homebrew/openhole.rb
```

Update SHA256 hashes in the Homebrew formula after each release.
