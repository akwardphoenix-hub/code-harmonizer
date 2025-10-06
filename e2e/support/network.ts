import { Page, test } from '@playwright/test';

export async function blockNonLocal(page: Page) {
  await page.route('**/*', async (route) => {
    const url = route.request().url();
    // Only allow 127.0.0.1, data:, and blob:
    const isLocal = url.startsWith('http://127.0.0.1') ||
                    url.startsWith('https://127.0.0.1');
    
    if (isLocal) return route.continue();
    
    // Allow fonts/images from data: and blob:
    if (url.startsWith('data:') || url.startsWith('blob:')) return route.continue();
    
    // Known external endpoints → fulfill with canned data
    if (url.includes('api.github.com/runtime/')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, mock: 'runtime' })
      });
    }
    
    if (url.includes('models.github.ai')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, mock: 'models' })
      });
    }
    
    // Default: block with informative message
    console.warn(`[E2E] Blocked external request: ${url}`);
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ mock: true, blocked: url })
    });
  });
}

// Auto-apply in every test
test.beforeEach(async ({ page }) => {
  await blockNonLocal(page);
});
