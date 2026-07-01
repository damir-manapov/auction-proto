#!/usr/bin/env bash
set -euo pipefail

export PNPM_CONFIG_TRUST_LOCKFILE=true

echo "=== Format ==="
pnpm format

echo "=== Lint ==="
pnpm lint

echo "=== Typecheck ==="
pnpm typecheck

echo "=== Typecheck (server) ==="
pnpm typecheck:server

echo "=== Typecheck (tests) ==="
pnpm typecheck:tests

echo "=== Tests ==="
pnpm test

echo "All checks completed successfully."
