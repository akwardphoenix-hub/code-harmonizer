import { test, expect } from '@playwright/test';

/**
 * Basic E2E tests for Code Harmonizer
 * These tests only interact with localhost and make no external network calls
 */

test.describe('Code Harmonizer - Basic functionality', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page title is correct
    await expect(page).toHaveTitle(/Code Harmonizer/i);
    
    // Check that the main heading is visible
    await expect(page.locator('h1')).toContainText('Code Harmonizer');
  });

  test('should display the source code editor', async ({ page }) => {
    await page.goto('/');
    
    // Check for Source Code tab
    const sourceTab = page.getByText('Source Code');
    await expect(sourceTab).toBeVisible();
  });

  test('should display the intention library', async ({ page }) => {
    await page.goto('/');
    
    // Check for Intention Library section
    const intentionLibrary = page.getByText('Intention Library');
    await expect(intentionLibrary).toBeVisible();
  });

  test('should have Load Sample button', async ({ page }) => {
    await page.goto('/');
    
    // Check for Load Sample button
    const loadSampleBtn = page.getByRole('button', { name: /Load Sample/i });
    await expect(loadSampleBtn).toBeVisible();
  });

  test('should load sample code when clicked', async ({ page }) => {
    await page.goto('/');
    
    // Click Load Sample button
    const loadSampleBtn = page.getByRole('button', { name: /Load Sample/i });
    await loadSampleBtn.click();
    
    // Wait a moment for the code to load
    await page.waitForTimeout(500);
    
    // Verify we're on the Source Code tab after loading sample
    const sourceTab = page.getByText('Source Code');
    await expect(sourceTab).toBeVisible();
  });

  test('should not make external API calls', async ({ page }) => {
    // Track all network requests
    const externalRequests: string[] = [];
    
    page.on('request', request => {
      const url = request.url();
      // Flag any non-localhost requests
      if (!url.includes('127.0.0.1') && !url.includes('localhost')) {
        externalRequests.push(url);
      }
    });
    
    await page.goto('/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Filter out data URIs and blob URLs which are fine
    const blockedRequests = externalRequests.filter(url => 
      !url.startsWith('data:') && 
      !url.startsWith('blob:')
    );
    
    // Assert no external requests were made
    expect(blockedRequests).toHaveLength(0);
  });
});
