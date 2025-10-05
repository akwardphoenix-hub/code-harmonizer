import { expect, test, beforeAll } from 'vitest';

beforeAll(() => {
  process.env.AGENT_SAFE = '1';
});

test('httpClient mock GET returns fixtures', async () => {
  const { http } = await import('./httpClient');
  const bills = await http.get('/api/congress/bills');
  expect(bills).toBeDefined();
});

test('httpClient mock POST returns echo', async () => {
  const { http } = await import('./httpClient');
  const res = await http.post('/api/council/vote', { choice: 'approve' });
  expect(res).toHaveProperty('ok');
});
