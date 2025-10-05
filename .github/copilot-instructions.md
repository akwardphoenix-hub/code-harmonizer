# Copilot Repo Instructions — Agent-Safe Mode

The Copilot coding agent runs in a sandbox with a firewall:
- ✅ Local file edits and unit/integration tests (Vitest/jsdom)
- ❌ No apt/https to `esm.ubuntu.com` or external downloads
- ❌ No HTTP servers (dev/preview) in agent sandbox
- ❌ No Playwright browser downloads inside agent

**Required behavior in Copilot agent:**
- Run **unit/integration** tests only (`npm run test:ci`).
- Use local **msw** mocks; never call network in tests.
- Do **not** run `vite dev` or `vite preview` in agent.
- Do **not** run Playwright E2E in agent.

**Where to run full E2E:**
- GitHub Actions workflow `.github/workflows/ci.yml`.
- E2E job installs Playwright and starts the server.

Environment flags:
- `AGENT_SAFE=1` → Switch services to mock mode; skip E2E; run Vitest.
- `ALLOW_E2E=1` (in GH Actions only) → run Playwright E2E after build/preview.

Follow the code in `src/env.ts`, `src/services/httpClient.ts`, and `src/mocks/*`.
