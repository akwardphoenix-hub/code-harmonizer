/**
 * Council data service with offline fixture support
 * Uses fixtures when VITE_OFFLINE=true, otherwise fetches from API
 */

import { OFFLINE } from '../lib/config';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/**
 * Fetches data with automatic fixture fallback in offline mode
 */
async function fetchData<T = JsonValue>(path: string): Promise<T> {
  if (OFFLINE) {
    // In offline mode, fetch from local fixtures
    const fixturePath = `/fixtures/${path.replace(/^\//, '')}`;
    const response = await fetch(fixturePath);
    
    if (!response.ok) {
      throw new Error(`Fixture not found: ${fixturePath}`);
    }
    
    return response.json() as Promise<T>;
  }

  // In online mode, fetch from actual API
  const response = await fetch(path);
  
  if (!response.ok) {
    throw new Error(`Fetch failed: ${path} -> ${response.status}`);
  }
  
  return response.json() as Promise<T>;
}

/**
 * Get sample council data
 */
export async function getCouncilData() {
  return fetchData('sample-data.json');
}

export default {
  getCouncilData,
};
