# Contributing to Code Harmonizer

Thank you for your interest in contributing to Code Harmonizer! This guide will help you get started.

## Development Setup

### Prerequisites
- Node.js 20+
- npm

### Getting Started

```bash
# Clone the repository
git clone https://github.com/akwardphoenix-hub/code-harmonizer.git
cd code-harmonizer

# Install dependencies
npm ci

# Start development server
npm run dev
```

## Testing

### Agent-Safe Unit Tests (No Network Required)

Run unit and integration tests in agent-safe mode:

```bash
npm run test:ci
```

This command:
- Sets `AGENT_SAFE=1` environment variable
- Uses local MSW mocks instead of network calls
- Runs fast (< 1 second)
- Works in Copilot agent sandbox (firewall-proof)

### Full E2E Tests (Requires Browsers)

E2E tests require Playwright browsers and a running preview server. These should **not** be run in the Copilot agent sandbox.

```bash
# Install Playwright browsers (one-time setup)
ALLOW_E2E=1 npx playwright install chromium

# Run E2E tests
ALLOW_E2E=1 npm run test:e2e
```

**Note:** Do not run E2E tests or start dev/preview servers in the Copilot agent environment. The agent runs behind a firewall that blocks:
- External downloads (browser installations)
- HTTP server operations
- Network requests

### Other Commands

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

## CI/CD

Our CI pipeline runs automatically on push and pull requests:

1. **Unit Job**: Runs typecheck, lint, and agent-safe tests
2. **E2E Job**: Installs browsers, builds, and runs full E2E tests

Both jobs run in parallel on GitHub Actions where browsers and network access are available.

## Code Style

- Follow the existing code style
- Run `npm run lint` before committing
- Ensure all tests pass with `npm run test:ci`

## Pull Request Guidelines

1. Fork the repository and create a new branch
2. Make your changes with clear, descriptive commits
3. Ensure all tests pass locally
4. Update documentation if needed
5. Submit a pull request with a clear description

## Questions?

Feel free to open an issue for any questions or concerns.
