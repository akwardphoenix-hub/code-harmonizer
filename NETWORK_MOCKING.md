# Network Mocking for CI/E2E Tests

## Overview

This document describes the network mocking strategy implemented to avoid firewall blocks during CI/E2E tests in GitHub Actions and Copilot agent environments.

## Problem

The CI/E2E tests were failing because they attempted to connect to blocked domains:
- `127.0.0.1` (localhost binding issues in sandboxed environments)
- `runtime.github.com` (GitHub API runtime)
- `models.github.ai` (GitHub Models API)

## Solution

### 1. Copilot Allowlist (`.github/copilot-allowlist.json`)

Added an allowlist file to permit GitHub domains:
```json
{
  "allowedDomains": [
    "runtime.github.com",
    "models.github.ai"
  ]
}
```

### 2. Environment Detection (`src/env.ts`)

Added `IS_TEST` flag to detect when running in test mode:
```typescript
export const ENV = {
  AGENT_SAFE: process.env.AGENT_SAFE === '1' || process.env.COPILOT_AGENT === 'true',
  ALLOW_E2E: process.env.ALLOW_E2E === '1',
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_TEST: process.env.NODE_ENV === 'test',
};
```

### 3. HTTP Client Mocking (`src/services/httpClient.ts`)

Updated the HTTP client to automatically mock GitHub API calls when `NODE_ENV=test`:

- All requests to `runtime.github.com` return mock data from `src/mocks/fixtures/github-runtime.json`
- All requests to `models.github.ai` return mock data from `src/mocks/fixtures/github-models.json`
- This prevents real network calls during tests while allowing normal operation in production

### 4. Network Binding Configuration

Updated configuration files to bind to `0.0.0.0` in CI environments instead of `127.0.0.1`:

#### `vite.config.ts`
```typescript
const host = process.env.CI ? '0.0.0.0' : '127.0.0.1';
```

#### `scripts/serve-dist.mjs`
```typescript
const HOST = process.env.CI ? '0.0.0.0' : '127.0.0.1';
```

#### `playwright.config.ts`
```typescript
const HOST = process.env.CI ? '0.0.0.0' : '127.0.0.1';
const BASE = `http://localhost:${PORT}`; // Browser always connects to localhost
```

### 5. CI Workflow Updates (`.github/workflows/ci.yml`)

Added environment variables to the test-offline job:
```yaml
env:
  NODE_ENV: 'test'
  ALLOW_E2E: '1'
```

## Mock Data

Mock data files provide realistic responses for testing:

- `src/mocks/fixtures/github-runtime.json` - GitHub runtime API responses
- `src/mocks/fixtures/github-models.json` - GitHub Models API responses

## Testing

Unit tests verify that the mocking works correctly:

```bash
# Run unit tests with mocking enabled
NODE_ENV=test npm run test:ci
```

The test file `src/services/httpClient.github.test.ts` verifies:
- GET requests to `runtime.github.com` are mocked
- GET requests to `models.github.ai` are mocked
- POST requests to GitHub domains are mocked

## Usage

### Local Development

Local development uses real network calls and binds to `127.0.0.1`:
```bash
npm run dev
```

### CI/E2E Testing

CI/E2E tests use mocked network calls and bind to `0.0.0.0`:
```bash
NODE_ENV=test ALLOW_E2E=1 npm run build && npm run test:e2e
```

### Agent-Safe Mode

Agent-safe mode uses comprehensive mocking for all API calls:
```bash
AGENT_SAFE=1 npm run test:ci
```

## Benefits

1. **No Firewall Blocks**: Tests run successfully in restricted environments
2. **Faster Tests**: No real network calls means faster test execution
3. **Reliable Tests**: Tests are not affected by network issues or API availability
4. **Backward Compatible**: Local development continues to work as expected
5. **CI-Ready**: Tests work seamlessly in GitHub Actions and Copilot agents
