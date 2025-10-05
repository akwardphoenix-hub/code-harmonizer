import { expect, test } from 'vitest';
import { OFFLINE, DATA_BASE, NOW_ISO } from './config';

test('config exports expected values', () => {
  expect(typeof OFFLINE).toBe('boolean');
  expect(DATA_BASE).toBe('/data');
  expect(typeof NOW_ISO).toBe('function');
});

test('NOW_ISO returns ISO string', () => {
  const iso = NOW_ISO();
  expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
});
