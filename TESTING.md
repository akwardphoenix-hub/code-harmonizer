# Testing Guide

This document describes how to test the Code Harmonizer application, including running tests locally and in CI environments.

## Overview

Code Harmonizer uses the following testing tools:
- **Playwright** - For end-to-end (E2E) browser testing
- **ESLint** - For code quality and linting

## Running Tests Locally

### Prerequisites

First, install all dependencies:

```bash
npm install
```

### E2E Tests

Run E2E tests with Playwright:

```bash
# Run E2E tests in headless mode
npm run test:e2e

# Run E2E tests with UI (interactive mode)
npm run test:e2e:ui
```

The E2E tests will automatically:
1. Start a local development server on `http://127.0.0.1:5173`
2. Run the test suite against the local server
3. Shut down the server when tests complete

### Linting

Run the linter to check code quality:

```bash
npm run lint
```

### Build Validation

Verify the project builds correctly:

```bash
npm run build
```

### Pre-publish Checks

Run all pre-publish validation checks:

```bash
./scripts/pre-publish-check.sh
```

This script runs build, lint, and other validation checks with timeout protection.

## CI Environment Notes

### Firewall and Network Restrictions

The test suite is designed to work in restricted CI environments where certain external hosts are blocked. The following measures are in place:

#### 1. **Ubuntu ESM Repository Blocks**

The CI workflow disables Ubuntu Pro / ESM repositories that may be blocked by firewalls:

```yaml
- name: Configure apt to skip esm.ubuntu.com
  run: |
    sudo rm -f /etc/apt/sources.list.d/ubuntu-esm-*.list 2>/dev/null || true
    sudo sed -i '/esm\.ubuntu\.com/d' /etc/apt/sources.list 2>/dev/null || true
```

This prevents `apt` from attempting to contact `esm.ubuntu.com` during package installation.

#### 2. **GitHub API Mocking**

Runtime checks that would normally call `api.github.com` are stubbed locally:

- The application uses mock responses when `GITHUB_API_MOCK=true` is set
- No external API calls are made during tests
- The `src/lib/llm.ts` file includes built-in mock functionality for development/testing

#### 3. **Localhost-Only Development Server**

The Vite development server is configured to bind only to localhost:

**vite.config.ts:**
```typescript
server: {
  host: '127.0.0.1',
  port: 5173,
  strictPort: true,
}
```

This ensures:
- No external network access during development
- Tests only communicate with `http://127.0.0.1:5173`
- No telemetry or analytics sent to external services

#### 4. **Playwright Configuration**

Playwright is configured to only test against localhost:

**playwright.config.ts:**
```typescript
use: {
  baseURL: 'http://127.0.0.1:5173',
  bypassCSP: false,
}
```

The E2E tests include a specific test that validates no external requests are made:

```typescript
test('should not make external API calls', async ({ page }) => {
  // Tracks and fails if any non-localhost requests occur
});
```

#### 5. **Pre-publish Check Timeout Protection**

The pre-publish script includes timeout protection to prevent infinite loops:

**scripts/pre-publish-check.sh:**
```bash
TIMEOUT=10
MAX_RETRIES=1

run_check() {
    timeout "$TIMEOUT" bash -c "$command" 2>/dev/null
    # Returns 0 even on failure - non-blocking
}
```

Features:
- Commands timeout after 10 seconds
- No infinite retry loops
- Failures are logged but don't block the entire check
- Network-dependent checks are skipped gracefully

### Environment Variables

The following environment variables control behavior in CI:

- `CI=true` - Enables CI-specific behavior (retries, single worker, etc.)
- `GITHUB_API_MOCK=true` - Forces use of mock API responses
- `DEBIAN_FRONTEND=noninteractive` - Prevents apt prompts

### Blocked Hosts

The following hosts are known to be blocked in some CI environments and should NOT be accessed:

- ❌ `esm.ubuntu.com` - Ubuntu Pro/ESM repositories
- ❌ `api.github.com` - GitHub API (use mocks instead)
- ❌ External telemetry/analytics services

### Allowed Hosts

The following hosts ARE allowed and can be accessed:

- ✅ `127.0.0.1` / `localhost` - Local development server
- ✅ Standard Ubuntu package mirrors (not ESM)
- ✅ `registry.npmjs.org` - For npm package installation

## Test Structure

### E2E Tests (`e2e/`)

End-to-end tests validate the complete user experience:

```
e2e/
├── basic.spec.ts          # Basic functionality tests
```

Test files should follow these conventions:
- Use `*.spec.ts` naming pattern
- Group related tests with `test.describe()`
- Test only localhost interactions
- Include assertions for no external network calls

### Example Test

```typescript
import { test, expect } from '@playwright/test';

test('should load the home page', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Code Harmonizer/i);
});
```

## Continuous Integration

The project uses GitHub Actions for CI. See `.github/workflows/test.yml` for the complete workflow.

The CI pipeline:
1. ✅ Disables ESM repositories
2. ✅ Installs dependencies
3. ✅ Runs linter (non-blocking)
4. ✅ Builds the project
5. ✅ Installs Playwright browsers
6. ✅ Runs E2E tests (localhost only)
7. ✅ Runs pre-publish checks
8. ✅ Uploads test results

## Troubleshooting

### Tests failing with network errors

If tests fail with network-related errors:

1. Verify the dev server is running on `127.0.0.1:5173`
2. Check that no external requests are being made
3. Ensure `GITHUB_API_MOCK=true` is set in CI
4. Review the test output for blocked hosts

### Pre-publish script loops indefinitely

The pre-publish script should never loop. If it does:

1. Check for recent changes to `scripts/pre-publish-check.sh`
2. Verify the `TIMEOUT` and `MAX_RETRIES` values
3. Ensure `set -e` is at the top of the script
4. Look for commands that don't respect timeouts

### Playwright installation fails

If Playwright browser installation fails:

```bash
# Install only Chromium (minimal install)
npx playwright install chromium --with-deps
```

In CI, this is handled automatically by the workflow.

## Adding New Tests

When adding new tests:

1. ✅ Place E2E tests in `e2e/` directory
2. ✅ Use `*.spec.ts` naming convention
3. ✅ Only test against localhost
4. ✅ Include test for no external API calls
5. ✅ Update this document if adding new test types

## Best Practices

- **Keep tests fast** - E2E tests should complete in seconds, not minutes
- **Test real user flows** - Focus on what users actually do
- **Avoid external dependencies** - Mock or stub external services
- **Use localhost only** - Never test against external URLs
- **Handle failures gracefully** - Tests should not cause infinite loops
- **Document test requirements** - Update this guide when needed

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [ESLint Documentation](https://eslint.org/)
- [Vite Configuration](https://vitejs.dev/config/)
