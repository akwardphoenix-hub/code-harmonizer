# Testing

## Quick Start

- Agent-safe unit/integration: `npm run test:ci`
- Agent-safe unit (watch): `npm run test:unit`
- Full E2E locally: `npx playwright install && npm run build && npm run preview & ALLOW_E2E=1 npm run test:e2e`
- **Agent Mode E2E**: `npm run test:e2e:agent` (no HTTP server, uses `file://`)

## How it works

- `AGENT_SAFE=1` → `src/services/httpClient.ts` uses fixtures instead of fetch
- `ALLOW_E2E=1` → `playwright.config.ts` launches `npm run preview` and runs E2E
- `AGENT_MODE=1` → Uses `file://` protocol, no network calls, agent fallbacks for KV/LLM

## Agent Mode (Copilot Sandbox)

Copilot's sandbox blocks HTTP and apt. Agent Mode provides:

1. **No HTTP server** - Opens built app via `file://` protocol
2. **No network calls** - KV/LLM use local fallbacks (`src/lib/agentFallbacks.ts`)
3. **Smoke tests only** - Runs `00-agent-smoke.spec.ts` with `@agent` tag
4. **Build included** - Automatically builds before testing

**Commands:**
```bash
npm run test:e2e:agent        # Run agent smoke test
npm run prepublish:agent      # Build + agent test (combined)
```

## CI

- `unit` job → typecheck, lint, `test:ci` (Vitest, no network)
- `e2e` job → install browsers, build, Playwright tests (with HTTP server)

**Agent Mode** is separate from CI and designed for Copilot sandbox constraints.
