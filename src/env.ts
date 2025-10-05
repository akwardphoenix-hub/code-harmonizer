export const ENV = {
  AGENT_SAFE: process.env.AGENT_SAFE === '1' || process.env.COPILOT_AGENT === 'true',
  ALLOW_E2E: process.env.ALLOW_E2E === '1',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
