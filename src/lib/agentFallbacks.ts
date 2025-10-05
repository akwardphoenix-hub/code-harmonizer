export const isAgent = () =>
  process.env.AGENT_MODE === '1' ||
  typeof (globalThis as any).__AGENT_MODE__ !== 'undefined';

/** KV storage shim that never calls network in Agent Mode */
export const kv = {
  get<T>(key: string): Promise<T | undefined> {
    if (isAgent()) {
      // In agent mode, use localStorage or return undefined
      try {
        const val = localStorage.getItem(key);
        return Promise.resolve(val ? JSON.parse(val) : undefined);
      } catch {
        return Promise.resolve(undefined);
      }
    }
    // Non-agent: call your real KV service here
    // For now, fallback to localStorage
    try {
      const val = localStorage.getItem(key);
      return Promise.resolve(val ? JSON.parse(val) : undefined);
    } catch {
      return Promise.resolve(undefined);
    }
  },

  set<T>(key: string, value: T): Promise<void> {
    if (isAgent()) {
      // In agent mode, use localStorage
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.warn('Agent KV set failed:', e);
      }
      return Promise.resolve();
    }
    // Non-agent: call your real KV service here
    // For now, fallback to localStorage
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('KV set failed:', e);
    }
    return Promise.resolve();
  },

  delete(key: string): Promise<void> {
    if (isAgent()) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn('Agent KV delete failed:', e);
      }
      return Promise.resolve();
    }
    // Non-agent: call your real KV service here
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('KV delete failed:', e);
    }
    return Promise.resolve();
  },

  keys(): Promise<string[]> {
    if (isAgent()) {
      try {
        return Promise.resolve(Object.keys(localStorage));
      } catch {
        return Promise.resolve([]);
      }
    }
    // Non-agent: call your real KV service here
    try {
      return Promise.resolve(Object.keys(localStorage));
    } catch {
      return Promise.resolve([]);
    }
  }
};

/** LLM shim that never calls network in Agent Mode */
export async function llm(prompt: string): Promise<string> {
  if (isAgent()) {
    console.log('[AGENT MODE] LLM stub called with prompt:', prompt.slice(0, 60) + '...');
    return `[AGENT_STUB] ${prompt.slice(0, 60)}…`;
  }
  // Non-agent: call your real LLM adapter here
  // For now, return a stub message
  console.log('[LLM] Stub called with prompt:', prompt.slice(0, 60) + '...');
  return `[LLM_STUB] ${prompt.slice(0, 60)}…`;
}
