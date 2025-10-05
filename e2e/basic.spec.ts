import { test, expect } from '@playwright/test';

test.describe('Code Harmonizer Basic Tests', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads successfully
    await expect(page).toHaveTitle(/Code Harmonizer/i);
    
    // Check for key UI elements
    await expect(page.getByText('Code Harmonizer')).toBeVisible();
  });

  test('should display intention library', async ({ page }) => {
    await page.goto('/');
    
    // Check for the Intention Library card
    await expect(page.getByText('Intention Library')).toBeVisible();
  });

  test('should display code editor', async ({ page }) => {
    await page.goto('/');
    
    // Check for the Source Code tab
    await expect(page.getByText('Source Code')).toBeVisible();
  });

  test('should display harmonization engine', async ({ page }) => {
    await page.goto('/');
    
    // Check for the Harmonization Engine card
    await expect(page.getByText('Harmonization Engine')).toBeVisible();
  });

  test('should work offline (no external network requests)', async ({ page }) => {
    // Block all external network requests to simulate offline mode
    await page.route('**/*', (route) => {
      const url = route.request().url();
      // Allow only localhost requests
      if (url.startsWith('http://127.0.0.1') || url.startsWith('http://localhost')) {
        route.continue();
      } else {
        route.abort();
      }
    });

    await page.goto('/');
    
    // Verify the app still loads
    await expect(page.getByText('Code Harmonizer')).toBeVisible();
  });
});
