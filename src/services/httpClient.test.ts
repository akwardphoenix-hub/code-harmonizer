import { describe, it, expect, vi } from 'vitest';
import { http } from './httpClient';

describe('httpClient', () => {
  it('should be defined', () => {
    expect(http).toBeDefined();
    expect(http.get).toBeDefined();
    expect(http.post).toBeDefined();
  });

  it('should have get and post methods', () => {
    expect(typeof http.get).toBe('function');
    expect(typeof http.post).toBe('function');
  });

  it('should handle congress API endpoint', async () => {
    const result = await http.get('/api/congress/bills');
    expect(result).toBeDefined();
  });

  it('should handle council proposals endpoint', async () => {
    const result = await http.get('/api/council/proposals');
    expect(result).toBeDefined();
  });

  it('should handle post requests', async () => {
    const result = await http.post('/api/council/vote', { vote: 'yes' });
    expect(result).toBeDefined();
  });
});
