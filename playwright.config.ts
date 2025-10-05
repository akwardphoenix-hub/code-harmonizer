import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
// For baseURL, always use localhost since that's where the browser connects
// The server (serve-dist.mjs) will bind to 0.0.0.0 in CI, 127.0.0.1 locally
const BASE = `http://localhost:${PORT}`;
const allowE2E = process.env.ALLOW_E2E === '1';

export default defineConfig({
  testDir: './e2e',
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  timeout: 30_000,
  retries: 0,
  use: {
    baseURL: BASE,
    trace: 'on-first-retry',
    headless: true,
  },
  webServer: allowE2E
    ? {
        command: 'node scripts/serve-dist.mjs',
        url: BASE,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        stderr: 'pipe',
      }
    : undefined,
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ]
});
