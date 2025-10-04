import { test, expect } from '@playwright/test';

test.describe('Code Harmonizer Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Mock external API calls to avoid network requests
    // This prevents failures due to firewall blocking esm.ubuntu.com and api.github.com
    await page.route('**/*esm.ubuntu.com*/**', route => {
      route.abort('blockedbyclient');
    });
    
    await page.route('**/*api.github.com*/**', route => {
      route.abort('blockedbyclient');
    });

    // Mock any other external requests
    await page.route('**/*fonts.googleapis.com*/**', route => {
      route.fulfill({ status: 200, body: '' });
    });

    await page.route('**/*fonts.gstatic.com*/**', route => {
      route.fulfill({ status: 200, body: '' });
    });

    await page.goto('/');
  });

  test('should load the application', async ({ page }) => {
    // Wait for the page to load
    await expect(page).toHaveTitle(/Code Harmonizer/);
    
    // Check for main heading
    await expect(page.getByRole('heading', { name: /Code Harmonizer/i })).toBeVisible();
  });

  test('should display intention library', async ({ page }) => {
    // Check if Intention Library card is visible
    await expect(page.getByText('Intention Library')).toBeVisible();
    
    // Check if some intentions are visible
    await expect(page.getByText('Optimize Performance')).toBeVisible();
    await expect(page.getByText('Modernize Syntax')).toBeVisible();
  });

  test('should load sample code', async ({ page }) => {
    // Click the Load Sample button
    await page.getByRole('button', { name: /Load Sample/i }).click();
    
    // Check if code editor has content
    const codeEditor = page.locator('textarea, [contenteditable="true"]').first();
    await expect(codeEditor).not.toBeEmpty();
  });

  test('should select intentions', async ({ page }) => {
    // Select an intention checkbox
    const optimizeCheckbox = page.getByRole('checkbox', { name: /Optimize Performance/i });
    await optimizeCheckbox.check();
    
    // Verify it's checked
    await expect(optimizeCheckbox).toBeChecked();
  });

  test('should harmonize code with mock LLM', async ({ page }) => {
    // Load sample code
    await page.getByRole('button', { name: /Load Sample/i }).click();
    
    // Select an intention
    const optimizeCheckbox = page.getByRole('checkbox', { name: /Optimize Performance/i });
    await optimizeCheckbox.check();
    
    // Click harmonize button
    await page.getByRole('button', { name: /Harmonize Code/i }).click();
    
    // Wait for harmonization to complete (uses mock LLM, should be fast)
    await page.waitForTimeout(1000);
    
    // Check if output tab shows harmonized code
    await page.getByRole('tab', { name: /Harmonized Code/i }).click();
    
    // Verify harmonized code is displayed
    const harmonizedEditor = page.locator('textarea, [contenteditable="true"]').last();
    await expect(harmonizedEditor).not.toBeEmpty();
  });

  test('should display audit trail', async ({ page }) => {
    // Load sample and harmonize
    await page.getByRole('button', { name: /Load Sample/i }).click();
    const optimizeCheckbox = page.getByRole('checkbox', { name: /Optimize Performance/i });
    await optimizeCheckbox.check();
    await page.getByRole('button', { name: /Harmonize Code/i }).click();
    
    // Wait for completion
    await page.waitForTimeout(1000);
    
    // Check for audit trail elements
    await expect(page.getByText('Audit Trail')).toBeVisible();
  });

  test('should reset all state', async ({ page }) => {
    // Load sample code
    await page.getByRole('button', { name: /Load Sample/i }).click();
    
    // Reset
    await page.getByRole('button', { name: /Reset All/i }).click();
    
    // Verify code editor is empty
    const codeEditor = page.locator('textarea, [contenteditable="true"]').first();
    await expect(codeEditor).toBeEmpty();
  });
});
