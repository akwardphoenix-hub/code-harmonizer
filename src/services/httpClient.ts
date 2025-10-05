import { ENV } from '../env';

// A tiny fetch wrapper that auto-switches to mock handlers when AGENT_SAFE=1
export interface HttpClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body: any): Promise<T>;
}

async function realGet<T>(path: string): Promise<T> {
  const res = await fetch(path, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
  return res.json() as Promise<T>;
}
async function realPost<T>(path: string, body: any): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
  return res.json() as Promise<T>;
}

async function mockGet<T>(path: string): Promise<T> {
  // Route known endpoints to fixtures
  if (path.startsWith('/api/congress/')) {
    const data = await import('../mocks/fixtures/congress.sample.json');
    // @ts-ignore dynamic import default compat
    return (data.default ?? data) as T;
  }
  if (path.startsWith('/api/council/proposals')) {
    const data = await import('../mocks/fixtures/council.proposals.json');
    return (data as any).default ?? data as T;
  }
  if (path.startsWith('/api/council/votes')) {
    const data = await import('../mocks/fixtures/council.votes.json');
    return (data as any).default ?? data as T;
  }
  if (path.startsWith('/api/audit')) {
    const data = await import('../mocks/fixtures/audit.log.json');
    return (data as any).default ?? data as T;
  }
  // Default empty
  return {} as T;
}

async function mockPost<T>(path: string, body: any): Promise<T> {
  // In agent-safe mode, POSTs mutate nothing; append to in-memory store if needed.
  // Return echo with id/timestamp to allow UI to proceed.
  return {
    ok: true,
    path,
    body,
    id: `mock-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
  } as unknown as T;
}

export const http: HttpClient = ENV.AGENT_SAFE
  ? { get: mockGet, post: mockPost }
  : { get: realGet, post: realPost };
