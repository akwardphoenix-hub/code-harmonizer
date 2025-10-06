import { expect, test, beforeEach } from 'vitest';
import { writeAuditLocal, getAuditLocal } from './audit';

beforeEach(() => {
  // Clear localStorage before each test
  localStorage.clear();
});

test('writeAuditLocal stores entry', () => {
  writeAuditLocal({
    actor: 'test-user',
    action: 'test-action',
    refId: 'test-ref',
  });
  
  const entries = getAuditLocal();
  expect(entries).toHaveLength(1);
  expect(entries[0]).toMatchObject({
    actor: 'test-user',
    action: 'test-action',
    refId: 'test-ref',
  });
  expect(entries[0].ts).toBeDefined();
});

test('getAuditLocal returns empty array initially', () => {
  const entries = getAuditLocal();
  expect(entries).toEqual([]);
});

test('multiple entries are stored in order', () => {
  writeAuditLocal({ actor: 'user1', action: 'action1' });
  writeAuditLocal({ actor: 'user2', action: 'action2' });
  
  const entries = getAuditLocal();
  expect(entries).toHaveLength(2);
  expect(entries[0].actor).toBe('user1');
  expect(entries[1].actor).toBe('user2');
});
