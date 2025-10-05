import { test, expect } from '@playwright/test';

test.describe('Code Harmonizer E2E', () => {
  test('should load the application', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads with the correct title
    await expect(page).toHaveTitle(/Code Harmonizer/i);
  });

  test('should display the main components', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForLoadState('networkidle');
    
    // Check for key elements
    await expect(page.getByText('Code Harmonizer')).toBeVisible();
    await expect(page.getByText('Intention Library')).toBeVisible();
  });

  test('should allow loading sample code', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForLoadState('networkidle');
    
    // Find and click the "Load Sample" button
    const loadSampleButton = page.getByRole('button', { name: /Load Sample/i });
    
    if (await loadSampleButton.isVisible()) {
      await loadSampleButton.click();
      
      // Verify that code was loaded (check for common code elements)
      await expect(page.getByText(/function/i)).toBeVisible();
    }
  });
});
