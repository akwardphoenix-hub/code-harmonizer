# Testing Guide

## Goals
- Agent-safe unit/integration (Vitest/jsdom + msw)
- Full E2E (Playwright) **only** in GitHub Actions (or locally if you allow it)

## Local Unit/Integration
```bash
npm ci
npm run test:ci      # uses AGENT_SAFE=1, no network
```

## Local E2E (optional)

Requires a local browser install; not for Copilot agent.

```bash
npm run build
ALLOW_E2E=1 npm run test:e2e
```

## CI

- `unit` job runs vitest (fast & agent-safe)
- `e2e` job installs Playwright browsers, builds, runs E2E
