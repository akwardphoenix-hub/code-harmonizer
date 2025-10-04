# E2E Tests for Code Harmonizer

This directory contains end-to-end tests for the Code Harmonizer application using Playwright.

## Overview

The E2E tests are designed to work in restricted network environments (like the copilot sandbox) by:

1. **Mocking External APIs**: All external network calls are intercepted and mocked to prevent failures due to firewall blocks
2. **Using Mock LLM**: The application already has a mock LLM fallback that doesn't require external API calls
3. **Testing Core Functionality**: Tests validate the key user workflows without requiring network access

## Network Call Handling

The tests mock the following external services:
- `esm.ubuntu.com` - Blocked by firewall in sandbox
- `api.github.com` - Blocked by firewall in sandbox  
- `fonts.googleapis.com` - Gracefully mocked
- `fonts.gstatic.com` - Gracefully mocked

All mocking is done in the `beforeEach` hook in the test files.

## Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run tests in UI mode for debugging
npm run test:e2e:ui

# Run tests with browser visible
npm run test:e2e:headed
```

## Test Coverage

The current test suite covers:

- ✅ Application loading
- ✅ Intention library display and selection
- ✅ Code editor functionality
- ✅ Sample code loading
- ✅ Code harmonization with mock LLM
- ✅ Audit trail display
- ✅ Reset functionality

## CI/CD Integration

The tests are configured to work with GitHub Copilot setup steps:
- Node 20 is installed
- Dependencies installed via `npm ci` (no external fetch loops)
- Playwright browsers installed via `npx playwright install --with-deps`
- Tests run without external network dependencies

## Configuration

See `playwright.config.ts` in the root directory for test configuration:
- Server runs on port 5000
- Tests use Chromium browser only
- Retries enabled on CI
- HTML reporter for test results
