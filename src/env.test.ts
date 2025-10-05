import { expect, test } from 'vitest';

test('ENV flags (smoke)', async () => {
  process.env.AGENT_SAFE = '1';
  const { ENV } = await import('./env');
  expect(ENV.AGENT_SAFE).toBe(true);
});
