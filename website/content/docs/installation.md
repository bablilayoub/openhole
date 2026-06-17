# Installation

OpenHole ships pre-built binaries for **macOS**, **Linux**, and **Windows** on **amd64** and **arm64**.

## Install script (macOS / Linux)

```bash
curl -fsSL https://openhole.dev/install.sh | sh
```

- Downloads from [GitHub Releases](https://github.com/bablilayoub/openhole/releases)
- Verifies SHA256 against `checksums.txt` when available
- Installs to `/usr/local/bin` (or `~/.local/bin` if you lack write access)

Pin a version:

```bash
OPENHOLE_VERSION=v0.2.1 curl -fsSL https://openhole.dev/install.sh | sh
```

Custom install directory:

```bash
INSTALL_DIR=~/.local/bin curl -fsSL https://openhole.dev/install.sh | sh
```

## Windows (PowerShell)

```powershell
irm https://openhole.dev/install.ps1 | iex
```

Installs to `%LOCALAPPDATA%\Programs\openhole\openhole.exe` and adds it to your user `PATH`.

Pin a version:

```powershell
$env:OPENHOLE_VERSION='v0.2.1'; irm https://openhole.dev/install.ps1 | iex
```

## Package managers

See [Package managers](package-managers.md) for Homebrew, Scoop, and Debian `.deb` builds.

## Build from source

Requirements: Go 1.23+

```bash
git clone https://github.com/bablilayoub/openhole.git
cd openhole
./scripts/build.sh
```

Binaries are written to `dist/`:

- `openhole-<os>-<arch>` (or `.exe` on Windows)
- `openhole-server-<os>-<arch>` (for self-hosting)

## Update

```bash
openhole update          # download and install latest release
openhole update --check  # check only, no install
```

Self-update verifies checksums. On Windows, re-run `install.ps1` if the install directory is not writable.

Disable update notifications when starting a tunnel:

```bash
export OPENHOLE_SKIP_UPDATE_CHECK=1
```

## Uninstall

With the CLI installed:

```bash
openhole uninstall
```

Without the CLI (macOS / Linux):

```bash
curl -fsSL https://openhole.dev/uninstall.sh | sh
```

Removes `openhole` from common install paths. Uses `sudo` only when needed.

## Verify installation

```bash
openhole --version
# openhole version 0.2.1
```

## Supported platforms

| OS | Architectures | Binary name |
|----|---------------|-------------|
| macOS | amd64, arm64 | `openhole-darwin-amd64` |
| Linux | amd64, arm64 | `openhole-linux-amd64` |
| Windows | amd64, arm64 | `openhole-windows-amd64.exe` |

All release assets and checksums are on [GitHub Releases](https://github.com/bablilayoub/openhole/releases).
