import { defineConfig, devices } from '@playwright/test';

const allowE2E = process.env.ALLOW_E2E === '1';

export default defineConfig({
  testDir: './e2e',
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
    headless: true,
  },
  webServer: allowE2E
    ? {
        command: 'npm run preview',
        port: 4173,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
