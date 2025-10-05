import { describe, it, expect } from 'vitest';
import { ENV } from './env';

describe('ENV configuration', () => {
  it('should have AGENT_SAFE property', () => {
    expect(ENV).toHaveProperty('AGENT_SAFE');
    expect(typeof ENV.AGENT_SAFE).toBe('boolean');
  });

  it('should have ALLOW_E2E property', () => {
    expect(ENV).toHaveProperty('ALLOW_E2E');
    expect(typeof ENV.ALLOW_E2E).toBe('boolean');
  });

  it('should have NODE_ENV property', () => {
    expect(ENV).toHaveProperty('NODE_ENV');
    expect(typeof ENV.NODE_ENV).toBe('string');
  });

  it('should detect AGENT_SAFE mode when environment variable is set', () => {
    // When AGENT_SAFE=1 is set via npm run test:ci
    // ENV.AGENT_SAFE will be true
    expect(ENV.AGENT_SAFE).toBe(true);
  });
});
