# Contributing to OpenHole

Thanks for your interest in OpenHole. This guide covers how to set up the project, run tests, and submit changes.

## Table of contents

- [Code of conduct](#code-of-conduct)
- [Ways to contribute](#ways-to-contribute)
- [Development setup](#development-setup)
- [Running tests](#running-tests)
- [Project structure](#project-structure)
- [Pull request guidelines](#pull-request-guidelines)
- [Release process](#release-process-maintainers)

---

## Code of conduct

Be respectful and constructive. OpenHole is a developer tool — keep discussions technical and focused.

Report abuse of the public tunnel service to [abuse@openhole.dev](mailto:abuse@openhole.dev).  
Report security issues privately — see [SECURITY.md](SECURITY.md).

---

## Ways to contribute

- **Bug reports** — Open a GitHub issue with reproduction steps
- **Feature requests** — Describe the use case, not just the solution
- **Code** — Bug fixes, tests, docs, and small features via pull request
- **Docs** — README, CONTRIBUTING, deployment guides

We prioritize:

1. Correctness and security
2. Simplicity over abstraction
3. Tests for non-trivial behavior changes

---

## Development setup

### Prerequisites

- Go 1.23+
- Node.js 22+ (for the landing page)
- Docker + Docker Compose (optional, for full stack)

### Clone and build

```bash
git clone https://github.com/bablilayoub/openhole.git
cd openhole

# Build CLI + server binaries
./scripts/build.sh

# Run server locally
PUBLIC_TUNNEL_DOMAIN=ophl.link \
TUNNEL_ENDPOINT_HOST=localhost:8080 \
PUBLIC_URL_SCHEME=http \
TRUST_PROXY_HEADERS=false \
go run ./cmd/openhole-server

# Run CLI (another terminal)
go run ./cmd/openhole 3000 --server ws://localhost:8080/tunnel
```

### Website

```bash
cd website
npm install
npm run dev
```

Open http://localhost:3000

### Full Docker stack

```bash
cd deployments
cp env.example .env
# Fill in CLOUDFLARE_API_TOKEN and other values
docker compose up -d --build
```

---

## Running tests

### Go (required before every PR)

```bash
# All packages, race detector
go test -race -count=1 ./...

# With coverage summary
go test -race -coverprofile=coverage.out ./...
go tool cover -func=coverage.out

# Vet + build
go vet ./...
go build ./...
```

### Website

```bash
cd website
npm ci
npm run build
```

CI runs both on every push and pull request to `main` / `master`.

---

## Project structure

```text
cmd/
  openhole/           CLI entrypoint
  openhole-server/    Tunnel server entrypoint
internal/
  client/             CLI tunnel client + local proxy
  server/             Registry, limits, public proxy, WebSocket handler
  protocol/           WebSocket message types + JSON framing
  shared/             Subdomain validation, headers, errors, version
website/              Next.js landing page
deployments/          Docker Compose, Caddyfile, env template
scripts/              build.sh, release.sh, install.sh, uninstall.sh
```

### Conventions

- Keep changes focused — one concern per PR
- Match existing naming and error handling style
- Add or update tests for behavior changes
- No unrelated refactors in bug-fix PRs
- Do not commit `.env`, secrets, or `node_modules/`

---

## Pull request guidelines

1. **Branch** from `main` with a descriptive name: `fix/subdomain-hold`, `feat/rate-limit-cleanup`
2. **Tests** — `go test -race ./...` must pass; add tests for new logic
3. **Commits** — Clear messages explaining *why*, not just *what*
4. **Scope** — Small, reviewable diffs are merged faster
5. **Docs** — Update README if user-facing behavior changes

### PR checklist

- [ ] `go test -race -count=1 ./...` passes
- [ ] `go vet ./...` passes
- [ ] Website builds if `website/` changed (`npm run build`)
- [ ] No secrets or `.env` files included
- [ ] README / CONTRIBUTING updated if needed

---

## Release process (maintainers)

```bash
# 1. Bump version in internal/shared/version.go
# 2. Build release artifacts
./scripts/release.sh v0.1.0

# 3. Tag and push
git tag v0.1.0
git push origin v0.1.0
```

Pushing a `v*` tag triggers the [Release workflow](.github/workflows/release.yml), which builds binaries for darwin/linux amd64/arm64 and attaches `checksums.txt` to the GitHub release.

Manual fallback:

```bash
gh release create v0.1.0 dist/openhole-* dist/checksums.txt --title v0.1.0
```

---

## Questions?

Open a GitHub issue or discussion. For security, email [security@openhole.dev](mailto:security@openhole.dev).
