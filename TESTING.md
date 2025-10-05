# Testing

## Quick Start

- Agent-safe unit/integration: `npm run test:ci`
- Agent-safe unit (watch): `npm run test:unit`
- Agent-safe CI run: `npm run test:ci`
- Full E2E locally: `npx playwright install && npm run build && npm run preview & ALLOW_E2E=1 npm run test:e2e`

## How it works

- `AGENT_SAFE=1` → `src/services/httpClient.ts` uses fixtures instead of fetch
- `ALLOW_E2E=1` → `playwright.config.ts` launches `npm run preview` and runs E2E

## CI

- `unit` job → typecheck, lint, `test:ci`
- `e2e` job → install browsers, build, Playwright tests

No external network needed for unit/integration. E2E runs where browsers & server are allowed.
