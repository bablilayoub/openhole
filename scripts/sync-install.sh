#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cp "${ROOT}/scripts/install.sh" "${ROOT}/website/public/install.sh"
chmod +x "${ROOT}/website/public/install.sh"
echo "Synced scripts/install.sh → website/public/install.sh"
