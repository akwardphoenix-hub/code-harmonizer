import { expect, test, beforeAll } from 'vitest';

beforeAll(() => {
  process.env.NODE_ENV = 'test';
});

test('httpClient mocks GitHub runtime.github.com in test mode', async () => {
  const { http } = await import('./httpClient');
  const result = await http.get('https://runtime.github.com/api/status');
  expect(result).toBeDefined();
  expect(result).toHaveProperty('status');
});

test('httpClient mocks GitHub models.github.ai in test mode', async () => {
  const { http } = await import('./httpClient');
  const result = await http.get('https://models.github.ai/v1/models');
  expect(result).toBeDefined();
  expect(result).toHaveProperty('model');
});

test('httpClient mocks POST to GitHub domains in test mode', async () => {
  const { http } = await import('./httpClient');
  const result = await http.post('https://models.github.ai/v1/completions', { 
    prompt: 'test' 
  });
  expect(result).toBeDefined();
  expect(result).toHaveProperty('ok');
});
