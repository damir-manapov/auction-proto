#!/usr/bin/env bash
set -euo pipefail

echo "=== Running check.sh ==="
bash check.sh

echo "=== Running health.sh ==="
bash health.sh

echo "All project checks passed."
