import { test, expect } from '@playwright/test';

/**
 * Offline E2E tests - blocks all network except localhost
 * These tests verify the app works completely offline using fixtures
 */

test.describe('Offline Mode Tests', () => {
  test.beforeEach(async ({ page, context }) => {
    // Block all network requests except localhost/127.0.0.1
    await context.route('**/*', (route) => {
      const url = route.request().url();
      
      // Allow localhost and 127.0.0.1
      if (
        url.startsWith('http://localhost') || 
        url.startsWith('http://127.0.0.1') ||
        url.startsWith('https://localhost') ||
        url.startsWith('https://127.0.0.1')
      ) {
        route.continue();
      } else {
        // Block all external network calls
        console.log(`🚫 Blocked external request: ${url}`);
        route.abort('blockedbyclient');
      }
    });
  });

  test('should load app without external network', async ({ page }) => {
    // Track any failed requests
    const failedRequests: string[] = [];
    
    page.on('requestfailed', (request) => {
      const url = request.url();
      if (!url.startsWith('http://localhost') && !url.startsWith('http://127.0.0.1')) {
        failedRequests.push(url);
      }
    });

    await page.goto('/');
    
    // Check that the page loads
    await expect(page).toHaveTitle(/Code Harmonizer/i);
    
    // Wait for app to fully load
    await page.waitForLoadState('networkidle');
    
    // Verify main components are visible
    await expect(page.getByText('Code Harmonizer')).toBeVisible();
    
    // Report any unexpected failed requests
    if (failedRequests.length > 0) {
      console.warn('⚠️ External requests attempted:', failedRequests);
    }
  });

  test('should work with fixtures in offline mode', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForLoadState('networkidle');
    
    // Verify app is functional
    await expect(page.locator('body')).toBeVisible();
    
    // Check that no external network errors are shown to user
    const errorText = page.getByText(/network error|failed to fetch/i);
    await expect(errorText).not.toBeVisible();
  });
});
