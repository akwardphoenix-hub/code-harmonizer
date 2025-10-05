import { test, expect } from '@playwright/test';

test.describe('Offline-first E2E', () => {
  test('loads app shell', async ({ page }) => {
    await page.goto('/');
    // Fallback to common app text; adjust to your UI if needed:
    await expect(page.locator('body')).toContainText(/(Harmonizer|Uppercut City|Dashboard)/i);
  });

  test('blocks external network', async ({ page, context }) => {
    await context.route('**/*', (route) => {
      const url = route.request().url();
      const isLocal = url.startsWith('http://127.0.0.1:4173') || url.startsWith('http://localhost:4173');
      if (isLocal) {
        route.continue();
      } else {
        route.abort();
      }
    });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('main UI mounts (smoke)', async ({ page }) => {
    await page.goto('/');
    const candidates = [
      '[data-testid="intention-library"]',
      '[data-testid="code-editor"]',
      '[data-testid="harmonization-engine"]',
      'text=/Intention Library/i',
      'text=/Harmonization/i'
    ];
    let found = false;
    for (const sel of candidates) {
      if (await page.locator(sel).first().count()) { found = true; break; }
    }
    expect(found).toBeTruthy();
  });
});
