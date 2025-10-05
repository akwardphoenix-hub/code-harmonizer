# E2E Testing - Offline-First Approach

## Overview

This directory contains End-to-End (E2E) tests that work in offline-first environments, including GitHub Copilot sandboxes where network access is restricted.

## Configuration

### Playwright Config (`playwright.config.ts`)

The Playwright configuration has been updated to:
- Use `npm run preview` (static build server) instead of `npm run dev`
- Serve the pre-built `dist/` folder at http://127.0.0.1:5173
- Run with Chromium only to minimize browser download size

### Pre-Installation Workflow (`.github/copilot-setup-steps.yml`)

This workflow ensures dependencies and browsers are installed before the agent sandbox:
1. Checks out code
2. Sets up Node.js 20.x with npm caching
3. Runs `npm ci` to install dependencies
4. Installs Playwright Chromium browser with system dependencies
5. Builds the static app (`npm run build`)
6. Uploads the `dist` folder as an artifact for agent reuse

## Running Tests

### Locally (with network)

```bash
# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install chromium --with-deps

# Build the app
npm run build

# Run E2E tests
npm run test:e2e
```

### In CI/Agent Sandbox (offline)

The GitHub Actions workflow or agent sandbox should:
1. Download the `dist-bundle` artifact (pre-built app)
2. Use pre-installed Playwright browsers
3. Run tests without any network calls:

```bash
# Tests will use pre-built dist/ and pre-installed browsers
npm run test:e2e
```

## Test Structure

### `basic.spec.ts`

Basic smoke tests that verify:
- Application loads successfully
- Key UI components are visible
- App works without external network requests

### Writing Offline-First Tests

When writing new tests, ensure they:
1. Don't make external API calls (mock them if needed)
2. Only access localhost URLs
3. Use static build artifacts from `dist/`

Example of blocking external network requests:

```typescript
test('should work offline', async ({ page }) => {
  // Block all external requests
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (url.startsWith('http://127.0.0.1') || url.startsWith('http://localhost')) {
      route.continue();
    } else {
      route.abort();
    }
  });

  await page.goto('/');
  // Your test assertions...
});
```

## Troubleshooting

### Browser Not Installed

If you see "Executable doesn't exist" errors:
- Ensure `npx playwright install chromium --with-deps` was run
- In CI/sandbox, verify the pre-install workflow completed successfully

### Build Artifacts Missing

If tests fail with 404 errors:
- Run `npm run build` to generate the `dist/` folder
- Verify `dist/` exists and contains `index.html`

### Network Errors

If you see network-related errors:
- Check that the app is using the pre-built static server (`npm run preview`)
- Ensure no external dependencies are loaded at runtime
- Verify all assets are bundled in `dist/`
