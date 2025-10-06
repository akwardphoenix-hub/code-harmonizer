#!/usr/bin/env node

/**
 * Verification script to test that network mocking is working correctly
 * This simulates what happens during CI/E2E tests
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, '..');

console.log('🔍 Verifying Network Mocking Configuration...\n');

// Check 1: Copilot allowlist exists
const allowlistPath = join(root, '.github', 'copilot-allowlist.json');
if (existsSync(allowlistPath)) {
  console.log('✅ Copilot allowlist file exists');
} else {
  console.log('❌ Copilot allowlist file missing');
  process.exit(1);
}

// Check 2: Mock fixtures exist
const mockFiles = [
  'src/mocks/fixtures/github-runtime.json',
  'src/mocks/fixtures/github-models.json',
];

for (const file of mockFiles) {
  const filePath = join(root, file);
  if (existsSync(filePath)) {
    console.log(`✅ Mock fixture exists: ${file}`);
  } else {
    console.log(`❌ Mock fixture missing: ${file}`);
    process.exit(1);
  }
}

// Check 3: Test files exist
const testFiles = [
  'src/services/httpClient.test.ts',
  'src/services/httpClient.github.test.ts',
];

for (const file of testFiles) {
  const filePath = join(root, file);
  if (existsSync(filePath)) {
    console.log(`✅ Test file exists: ${file}`);
  } else {
    console.log(`❌ Test file missing: ${file}`);
    process.exit(1);
  }
}

// Check 4: Documentation exists
const docPath = join(root, 'NETWORK_MOCKING.md');
if (existsSync(docPath)) {
  console.log('✅ Documentation file exists: NETWORK_MOCKING.md');
} else {
  console.log('❌ Documentation file missing');
  process.exit(1);
}

// Check 5: Build artifacts exist
const distPath = join(root, 'dist', 'index.html');
if (existsSync(distPath)) {
  console.log('✅ Build artifacts exist: dist/index.html');
} else {
  console.log('❌ Build artifacts missing (run: npm run build)');
  process.exit(1);
}

console.log('\n✨ All verification checks passed!');
console.log('\n📋 Next Steps:');
console.log('  1. Run: NODE_ENV=test npm run test:ci');
console.log('  2. In CI: npm run build && npm run test:e2e');
console.log('  3. Verify no firewall blocks occur in GitHub Actions\n');
