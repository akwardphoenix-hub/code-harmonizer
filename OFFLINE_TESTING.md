# Offline Testing Guide

## Overview

The Code Harmonizer app is designed to work completely offline, using fixtures instead of real API calls when `VITE_OFFLINE=true`. This enables testing in restricted network environments like GitHub Copilot's sandbox.

## Quick Start

### One-time setup

```bash
# Install dependencies
npm ci

# Install Playwright browser
npx playwright install chromium
```

### Running offline tests

```bash
# Build the app
npm run build

# Start preview server (serves built app)
npm run preview

# In another terminal, run E2E tests
npm run test:e2e
```

## How It Works

### 1. Configuration (`src/lib/config.ts`)

The app automatically detects offline mode:

```typescript
export const OFFLINE = 
  import.meta.env.VITE_OFFLINE === 'true' ||  // Explicit offline flag
  !!import.meta.env.CI ||                      // CI environment
  import.meta.env.MODE === 'test';             // Test mode
```

### 2. Data Services (`src/services/councilData.ts`)

Services automatically use fixtures when offline:

```typescript
async function fetchData<T>(path: string): Promise<T> {
  if (OFFLINE) {
    // Fetch from /fixtures/ directory
    return fetch(`/fixtures/${path}`).then(r => r.json());
  }
  // Fetch from real API
  return fetch(path).then(r => r.json());
}
```

### 3. Network Blocking (`e2e/offline.spec.ts`)

Tests block all external network requests:

```typescript
await context.route('**/*', (route) => {
  const url = route.request().url();
  
  if (url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) {
    route.continue();  // Allow localhost
  } else {
    route.abort();     // Block external requests
  }
});
```

### 4. Fixtures (`public/fixtures/`)

Sample data files served by Vite preview:

```
public/fixtures/
  └── sample-data.json
```

## CI/CD Integration

### GitHub Actions (`.github/workflows/main.yml`)

```yaml
- name: Run E2E tests
  env:
    ALLOW_E2E: '1'
    VITE_OFFLINE: 'true'
  run: npm run test:e2e
```

### Copilot Setup (`.github/copilot-setup-steps.yml`)

Pre-installs everything before firewall activates:

1. Install Node.js 20 with npm cache
2. Run `npm ci` to install dependencies
3. Run `npm run build` to build the app
4. Install Playwright Chromium browser
5. Validate with lint and typecheck

## Acceptance Criteria

✅ **No network calls during tests** - All external requests blocked except 127.0.0.1  
✅ **npm run build + npm run preview** - Serves the built app  
✅ **npm run test:e2e** - Runs Playwright against local preview and passes  
✅ **VITE_OFFLINE=true** - App uses fixtures automatically  
✅ **Copilot setup steps** - Pre-install deps/browser before firewall  
✅ **No external URLs** - No references to esm.ubuntu.com or external domains at test time  

## Troubleshooting

### Build fails

```bash
# Clean and rebuild
rm -rf dist node_modules
npm ci
npm run build
```

### Tests fail with "net::ERR_CONNECTION_REFUSED"

Make sure preview server is running:

```bash
npm run preview  # Should show: Serving dist at http://127.0.0.1:4173
```

### Tests fail with "Fixture not found"

Add the required fixture to `public/fixtures/`:

```bash
echo '{"data": []}' > public/fixtures/your-fixture.json
```

### External network requests detected

Check the test output for blocked URLs and add fixtures for those endpoints.

## Development

When developing locally, you can test both online and offline modes:

```bash
# Online mode (default)
npm run dev

# Offline mode with fixtures
VITE_OFFLINE=true npm run dev
```

## Adding New Fixtures

1. Create fixture file: `public/fixtures/your-data.json`
2. Add data service: `src/services/yourData.ts`
3. Use OFFLINE flag to switch between real API and fixtures
4. Test with `VITE_OFFLINE=true npm run test:e2e`
