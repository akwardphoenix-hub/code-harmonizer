import { defineConfig, devices } from '@playwright/test';

const allowE2E = process.env.ALLOW_E2E === '1'; // GH Actions sets this to 1

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: true,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  // Only start webServer if E2E is allowed (GH Actions)
  webServer: allowE2E
    ? {
        command: 'npm run build && npm run preview',
        url: 'http://127.0.0.1:4173',
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
  // If not allowed, ignore E2E tests entirely
  testIgnore: allowE2E ? [] : ['**/*'],
});
