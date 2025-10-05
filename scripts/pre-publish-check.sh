#!/usr/bin/env bash
set -euo pipefail

echo "=== Masternode Council – Pre-Publish Validation ==="

# Detect environment
if [ "${CI:-}" = "true" ] && [ "${GITHUB_API_ALLOW:-0}" != "1" ]; then
  echo "⚠️  Copilot sandbox detected (firewall active)."
  echo "    Skipping network-dependent checks..."
  SKIP_NET=1
else
  SKIP_NET=0
fi

# --- Step 1: Check Node.js and npm versions ---
echo "--- Checking Node.js & npm versions ---"
node -v
npm -v

# --- Step 2: Install dependencies ---
echo "--- Installing dependencies ---"
npm install --no-audit --no-fund

# --- Step 3: TypeScript compile ---
echo "--- Running TypeScript build ---"
npm run build || { echo "❌ Build failed"; exit 1; }

# --- Step 4: Linting ---
echo "--- Running ESLint ---"
npm run lint || { echo "❌ Lint failed"; exit 1; }

# --- Step 5: Security checks (local only) ---
if [ "$SKIP_NET" -eq 0 ]; then
  echo "--- Running npm audit ---"
  npm audit --audit-level=high || true
else
  echo "⏭️  Skipping npm audit (no network)"
fi

# --- Step 6: Test suite ---
echo "--- Running tests ---"
npm test || { echo "❌ Tests failed"; exit 1; }

# --- Step 7: End-to-end tests ---
if [ -d "e2e" ]; then
  echo "--- Running Playwright E2E tests ---"
  if [ "$SKIP_NET" -eq 0 ]; then
    npx playwright install --with-deps
  else
    echo "⏭️  Skipping browser download (no network)"
  fi
  npm run test:e2e || { echo "❌ E2E tests failed"; exit 1; }
else
  echo "ℹ️  No e2e/ directory found, skipping"
fi

# --- Step 8: Build artifact validation ---
echo "--- Validating dist/ folder ---"
if [ -d "dist" ]; then
  ls -lh dist/
else
  echo "❌ No dist/ folder found after build"
  exit 1
fi

# --- Step 9: Check for debug code ---
echo "--- Checking for stray console.log and TODOs ---"
if grep -R "console.log" src/ >/dev/null; then
  echo "❌ Found console.log statements. Please remove."
  exit 1
fi
if grep -R "TODO" src/ >/dev/null; then
  echo "❌ Found TODO comments. Please resolve."
  exit 1
fi

# --- Step 10: Final status ---
echo "✅ Pre-publish validation complete. Ready for merge/publish."
