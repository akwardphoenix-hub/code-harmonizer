import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for E2E tests
 * Configured to work in CI environments with firewall restrictions:
 * - Only tests against localhost (127.0.0.1)
 * - No external API calls
 * - No telemetry or analytics
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    // Base URL for all tests - localhost only
    // Note: Spark plugin may override port, check actual server output
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:5173',
    trace: 'on-first-retry',
    // Disable any external connections
    bypassCSP: false,
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Run local dev server before tests
  webServer: {
    command: 'npm run dev',
    // Note: Spark plugin may use port 5000 instead of 5173
    url: process.env.BASE_URL || 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
