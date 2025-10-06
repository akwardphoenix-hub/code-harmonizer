import { expect, test } from 'vitest';
import { OFFLINE, BASE_URL } from './config';

test('config exports expected values', () => {
  expect(typeof OFFLINE).toBe('boolean');
  expect(typeof BASE_URL).toBe('string');
});

test('OFFLINE is true in test mode', () => {
  // In vitest, MODE should be 'test'
  expect(OFFLINE).toBe(true);
});

test('BASE_URL has expected format', () => {
  expect(BASE_URL).toMatch(/^http:\/\/127\.0\.0\.1:\d+$/);
});
