import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const HOST = '127.0.0.1';
const BASE = `http://${HOST}:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: {
    baseURL: BASE,
    trace: 'on-first-retry',
    browserName: 'chromium',
  },
  webServer: {
    command: 'node scripts/serve-dist.mjs',
    url: BASE,
    reuseExistingServer: !process.env.CI,
    timeout: 15_000,
    stderr: 'pipe',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ]
});
