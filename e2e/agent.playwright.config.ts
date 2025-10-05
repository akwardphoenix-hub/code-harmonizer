import { defineConfig } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const indexHtml = path.join(dist, 'index.html');
const fileBaseURL = pathToFileURL(indexHtml).toString();

function build() {
  // Build without starting any web server
  console.log('Building app for Agent Mode...');
  execSync('npm run build', { stdio: 'inherit', cwd: root });
}

// Build before running tests
build();

export default defineConfig({
  testDir: path.join(root, 'e2e'),
  // Only run agent-smoke tests in Agent Mode
  grep: /@agent/,
  timeout: 30_000,
  retries: 1,
  use: {
    headless: true,
    baseURL: fileBaseURL, // file://…/dist/index.html
    // Ensure no network; if Playwright tries any request, fail fast:
    bypassCSP: false,
  },
  reporter: [['list']],
  projects: [
    { name: 'chromium', use: { channel: 'chromium' } },
  ],
});
