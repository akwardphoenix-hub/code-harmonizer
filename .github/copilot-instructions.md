# Copilot Repo Instructions — Agent-Safe Mode

The Copilot coding agent runs behind a firewall:
- ✅ Local file edits + unit/integration tests (Vitest + jsdom)
- ❌ No external apt/https downloads (e.g., esm.ubuntu.com)
- ❌ No HTTP servers in agent (no `vite dev` / `vite preview`)
- ❌ No Playwright browser installs in agent

## Required behavior inside agent

- Run **unit/integration** tests only: `npm run test:ci`
- Use built-in **mock** paths (no network requests)
- Do **not** run Playwright E2E in agent
- Do **not** start servers in agent

## Where to run full E2E

- GitHub Actions workflow `.github/workflows/ci.yml`
- E2E job sets `ALLOW_E2E=1`, installs Playwright, builds, and runs tests

## Environment flags

- `AGENT_SAFE=1` → forces mock mode; skip E2E; run Vitest
- `ALLOW_E2E=1` → CI-only; run Playwright after build/preview

See: `src/env.ts`, `src/services/httpClient.ts`, `e2e/basic.spec.ts`.
