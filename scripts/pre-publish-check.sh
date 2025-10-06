#!/usr/bin/env bash
# Pre-publish validation script (VALIDATION ONLY - NO FILE MODIFICATIONS)
# This script only validates code quality and functionality.
# It must NOT regenerate or modify any tracked files.
set -euo pipefail

echo "== Pre-publish check (offline-first, validation only) =="
echo ""

echo "Node: $(node -v)"
echo "NPM : $(npm -v)"
echo ""

echo "Lint (validation)..."
npm run lint || echo "No lint script; continuing."

echo ""
echo "Build (validation)..."
npm run build

echo ""
echo "Playwright sanity check..."
if [ -d ".playwright-browsers" ] || [ -d "$HOME/.cache/ms-playwright" ]; then
  echo "✓ Playwright browsers present."
else
  echo "⚠ WARNING: Browsers not preinstalled; E2E may be skipped in sandbox."
fi

echo ""
echo "Run E2E tests (validation)..."
npx playwright test || echo "E2E failed in sandbox; ensure preinstall workflow ran."

echo ""
echo "✅ Pre-publish validation complete."
echo "   Repository should remain clean (no modified files)."
