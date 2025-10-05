import { test, expect } from '@playwright/test';
import './support/network';

test('app loads and shows Code Harmonizer', async ({ page }) => {
  await page.goto('/');
  // Check the app loads and displays main heading
  await expect(page.getByText(/Code Harmonizer/i)).toBeVisible();
  await expect(page.getByText(/Intention Library/i)).toBeVisible();
});
