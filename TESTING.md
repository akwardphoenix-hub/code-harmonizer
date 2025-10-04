# Testing Documentation

## E2E Testing Setup

This project includes end-to-end tests using Playwright that are designed to work in restricted network environments.

### Key Features

1. **Network Call Mocking**: All external API calls are mocked to prevent failures in sandboxed environments
2. **No External Dependencies**: Tests use the built-in mock LLM instead of real API calls
3. **CI/CD Ready**: Configured with `.github/copilot-setup-steps.yml` for automated testing

### Problem Solved

The E2E tests were failing because the sandbox firewall blocks:
- `esm.ubuntu.com`
- `api.github.com`

### Solution Implemented

1. **Renamed setup file**: `.github/Copilot-setup-steps.yml` → `.github/copilot-setup-steps.yml` (lowercase)
2. **Using `npm ci`**: The setup file uses `npm ci` instead of `npm install` to avoid external fetch loops
3. **Mocking external APIs**: All network calls are intercepted in the E2E tests (`e2e/basic.spec.ts`)
4. **Mock LLM**: Application already has a fallback mock LLM that doesn't require network access

### Setup Steps (for CI/CD)

The `.github/copilot-setup-steps.yml` file contains:

```yaml
setup:
  steps:
    - name: Install system deps
      run: sudo apt-get update && sudo apt-get install -y curl gnupg
    - name: Setup Node
      uses: actions/setup-node@v3
      with:
        node-version: 20
        cache: 'npm'
    - name: Install project deps
      run: npm ci
    - name: Install Playwright browsers
      run: npx playwright install --with-deps
```

### Running Tests Locally

```bash
# Install dependencies
npm ci

# Install Playwright browsers
npx playwright install --with-deps

# Run E2E tests
npm run test:e2e

# Run with UI for debugging
npm run test:e2e:ui
```

### Test Structure

```
e2e/
├── README.md           # E2E-specific documentation
└── basic.spec.ts       # Core functionality tests with API mocking
```

All tests include comprehensive API mocking in their `beforeEach` hooks to ensure no external network calls are made.

### Configuration Files

- `playwright.config.ts` - Playwright configuration
- `vite.config.ts` - Updated to use port 5000 for consistency
- `.gitignore` - Excludes test artifacts (test-results/, playwright-report/)
