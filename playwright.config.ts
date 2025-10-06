import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
// Use 127.0.0.1 for strict localhost-only testing (no external network)
const BASE_URL = `http://127.0.0.1:${PORT}`;
const allowE2E = process.env.ALLOW_E2E === '1';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: true,
  retries: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // Block all non-localhost requests by default
    permissions: [],
  },
  // Serve the built app from dist/ with vite preview
  webServer: allowE2E ? {
    command: 'npm run preview',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  } : undefined,
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
