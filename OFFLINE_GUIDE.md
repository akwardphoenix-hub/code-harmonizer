# Offline-First CI/Agent Guide

## Overview

This repository is now fully offline-capable for CI/agent runs. All builds and tests run using only preinstalled dependencies and localhost services.

## Key Features

### 1. Offline-First Data Service

The new `src/services/councilService.ts` provides:
- Remote API fetch with 4-second timeout
- Automatic fallback to local JSON files
- No console errors on network failures
- Works in test mode via `VITE_OFFLINE_ONLY=true`

### 2. Local JSON Fallbacks

All data is available locally in `public/data/`:
- `/data/council.proposals.json` - Council proposals
- `/data/council.votes.json` - Vote records
- `/data/audit.log.json` - Audit trail

These files are copied to `dist/data/` during build and served by the preview server.

### 3. Environment Variables

**`.env.example`** - Optional remote API configuration
```bash
VITE_CONGRESS_API=
VITE_OFFLINE_ONLY=false
```

**`.env.test`** - Forces offline mode in tests
```bash
VITE_CONGRESS_API=
VITE_OFFLINE_ONLY=true
```

### 4. CI/E2E Scripts

**Local Development:**
```bash
npm run dev              # Dev server on 127.0.0.1:5173
npm run preview          # Preview built app on 127.0.0.1:4173
npm run test:e2e         # E2E tests (auto-starts preview)
```

**CI Mode:**
```bash
npm run ci:all           # Preview + wait-on + E2E tests
```

This single command:
1. Starts preview server in background
2. Waits for http://127.0.0.1:4173 to be ready
3. Runs Playwright tests with line reporter
4. Server auto-terminates when tests complete

### 5. Playwright Configuration

The `playwright.config.ts` is environment-aware:
- **Local mode**: Auto-starts preview server via `webServer` config
- **CI mode**: Skips `webServer` (handled by `ci:all` script)
- Always uses `baseURL: http://127.0.0.1:4173`
- Retries: 2 in CI, 0 locally

### 6. GitHub Actions Workflow

The `.github/workflows/test.yml`:
1. Installs dependencies with `npm ci --no-audit --prefer-offline`
2. Installs only Chromium browser
3. Builds with `NODE_ENV=production`
4. Runs tests with `VITE_OFFLINE_ONLY=true`
5. Uses `npm run ci:all` for stable preview + test

### 7. Copilot Setup Steps

The `.github/copilot-setup-steps.yml` provides pre-install steps:
- Node.js 20 setup with npm cache
- Install dependencies (no audit, prefer offline)
- Install Playwright Chromium browser only
- Build app (localhost only, no telemetry)

## Why This Fixes Firewall Blocks

### Before
- ❌ Agent tried to fetch from external APIs during tests
- ❌ Vite made HTTP calls at build time
- ❌ Preview server bound to 0.0.0.0 (blocked in sandbox)
- ❌ Tests failed when network unavailable

### After
- ✅ All deps preinstalled before firewall
- ✅ Preview server on 127.0.0.1 only
- ✅ Local JSON fallbacks always available
- ✅ No external network calls in test mode
- ✅ Stable, deterministic CI runs

## Usage Examples

### Testing Offline Mode Locally
```bash
# Set offline mode
export VITE_OFFLINE_ONLY=true

# Build and test
npm run build
npm run ci:all
```

### Debugging E2E Tests
```bash
npm run test:e2e:headed    # Run with browser visible
npm run test:e2e:debug     # Run with Playwright Inspector
npm run test:e2e:ui        # Run with Playwright UI
```

### Verifying Data Endpoints
```bash
npm run preview &
sleep 3
curl http://127.0.0.1:4173/data/council.proposals.json | jq
curl http://127.0.0.1:4173/data/council.votes.json | jq
curl http://127.0.0.1:4173/data/audit.log.json | jq
pkill -f "vite preview"
```

## Integration with Existing Code

### Using councilService in Components

Replace direct fetch calls with the service:

```typescript
// Before
const data = await fetch('/api/council/proposals').then(r => r.json());

// After
import { getProposals } from '@/services/councilService';
const data = await getProposals();
```

The service automatically:
- Tries remote API if `VITE_CONGRESS_API` is set
- Falls back to local JSON in test mode or on network failure
- Never throws console errors

### Environment Detection

```typescript
// Check if running in offline mode
const isOffline = 
  import.meta.env.MODE === 'test' ||
  String(import.meta.env.VITE_OFFLINE_ONLY || '').toLowerCase() === 'true';
```

## Troubleshooting

### Preview Server Won't Start
```bash
# Kill any existing process on port 4173
pkill -f "vite preview"
fuser -k 4173/tcp

# Try again
npm run preview
```

### Playwright Browser Missing
```bash
# Install Chromium only
npx playwright install chromium
```

### Tests Timeout
- Check preview server is running: `curl http://127.0.0.1:4173`
- Increase timeout in `playwright.config.ts` if needed
- Run with debug: `npm run test:e2e:debug`

## Summary

The repository is now fully offline-capable:
- ✅ No firewall blocks
- ✅ No external API dependencies in CI
- ✅ Stable, fast E2E tests
- ✅ Local development unchanged
- ✅ Clean fallback to local JSON
- ✅ Single `npm run ci:all` command
