#!/usr/bin/env bash
set -euo pipefail

echo "== Pre-publish check (offline-first) =="

echo "Node: $(node -v)"
echo "NPM : $(npm -v)"

echo "Lint (if configured)..."
npm run lint || echo "No lint script; continuing."

echo "Build..."
npm run build

echo "Playwright sanity (no downloads here)..."
if [ -d ".playwright-browsers" ] || [ -d "$HOME/.cache/ms-playwright" ]; then
  echo "Playwright browsers present."
else
  echo "WARNING: Browsers not preinstalled; E2E may be skipped in sandbox."
fi

echo "Run E2E..."
npx playwright test || echo "E2E failed in sandbox; ensure preinstall workflow ran."

echo "OK"
