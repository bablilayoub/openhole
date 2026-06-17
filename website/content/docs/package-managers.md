# Package managers

Beyond the install scripts, OpenHole can be installed via Homebrew, Scoop, or a Debian package.

Manifests live in the repository under `packaging/`.

## Homebrew (macOS / Linux)

Formula: `packaging/homebrew/openhole.rb`

```bash
# From a local checkout
brew install ./packaging/homebrew/openhole.rb
```

For a tap, copy the formula to `homebrew-tap/Formula/openhole.rb` and update SHA256 hashes after each release (from `checksums.txt` on GitHub Releases).

The formula downloads `openhole-darwin-amd64` / `openhole-darwin-arm64` or Linux equivalents from GitHub Releases.

## Scoop (Windows)

Manifest: `packaging/scoop/openhole.json`

Add to your bucket or install directly:

```powershell
scoop install path\to\openhole.json
```

Downloads `openhole-windows-amd64.exe` or `openhole-windows-arm64.exe`.

Update the `hash` field after each release.

## apt / Debian

See `packaging/apt/README.md`.

### Quick install (manual)

```bash
VERSION=v0.2.1
ARCH=amd64   # or arm64
curl -fsSL -o /usr/local/bin/openhole \
  "https://github.com/bablilayoub/openhole/releases/download/${VERSION}/openhole-linux-${ARCH}"
chmod +x /usr/local/bin/openhole
```

Verify with `checksums.txt` from the same release.

### Build a .deb

Requires [nfpm](https://nfpm.goreleaser.com/):

```bash
VERSION=0.2.1 ARCH=amd64 ./packaging/apt/build-deb.sh
sudo dpkg -i dist/openhole_0.2.1_amd64.deb
```

## Install scripts (recommended)

| Platform | Command |
|----------|---------|
| macOS / Linux | `curl -fsSL https://openhole.dev/install.sh \| sh` |
| Windows | `irm https://openhole.dev/install.ps1 \| iex` |

Both verify SHA256 checksums when `checksums.txt` is published.

## Self-update

Regardless of install method:

```bash
openhole update
```

On Windows, if the install directory is not writable, re-run `install.ps1`.

## Release assets

Every tagged release includes:

| Asset | Description |
|-------|-------------|
| `openhole-darwin-amd64` | macOS Intel CLI |
| `openhole-darwin-arm64` | macOS Apple Silicon CLI |
| `openhole-linux-amd64` | Linux x86_64 CLI |
| `openhole-linux-arm64` | Linux ARM64 CLI |
| `openhole-windows-amd64.exe` | Windows x86_64 CLI |
| `openhole-windows-arm64.exe` | Windows ARM64 CLI |
| `openhole-server-*` | Server binaries (self-hosting) |
| `checksums.txt` | SHA256 checksums for all binaries |

[github.com/bablilayoub/openhole/releases](https://github.com/bablilayoub/openhole/releases)
