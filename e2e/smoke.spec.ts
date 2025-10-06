import { test, expect } from '@playwright/test';
import './support/network';

test.describe('Offline E2E Smoke Tests', () => {
  test('app loads from preview (127.0.0.1:4173)', async ({ page }) => {
    await page.goto('/');
    
    // Check the page loads with the correct title
    await expect(page).toHaveTitle(/Code Harmonizer/i);
    
    // Verify main heading is visible
    await expect(page.getByText(/Code Harmonizer/i).first()).toBeVisible();
  });

  test('no external network requests are made', async ({ page }) => {
    const blockedUrls: string[] = [];
    
    page.on('response', (response) => {
      const url = response.url();
      if (!url.startsWith('http://127.0.0.1') && 
          !url.startsWith('data:') && 
          !url.startsWith('blob:')) {
        blockedUrls.push(url);
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // All external requests should have been blocked
    expect(blockedUrls.length).toBe(0);
  });

  test('fixtures are accessible from /fixtures/', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Check if fixtures are accessible (they should be served from dist/fixtures)
    const response = await page.goto('/fixtures/council/proposals.json');
    expect(response?.status()).toBe(200);
    
    const json = await response?.json();
    expect(Array.isArray(json)).toBe(true);
    expect(json.length).toBeGreaterThan(0);
  });
});
