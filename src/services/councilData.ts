import { OFFLINE } from '../lib/config';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

async function fetchJson<T = JsonValue>(path: string): Promise<T> {
  if (OFFLINE) {
    // In offline/CI mode, load from /fixtures
    const res = await fetch(`/fixtures${path}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Fetch failed: ${path} -> ${res.status}`);
    return res.json() as Promise<T>;
  }
  // In dev with network, call real endpoint
  const res = await fetch(`/api${path}`);
  if (!res.ok) throw new Error(`Fetch failed: ${path} -> ${res.status}`);
  return res.json() as Promise<T>;
}

export type Proposal = {
  id: string;
  title: string;
  description?: string;
  createdAt: string; // ISO
  votingEndsAt?: string; // ISO
};

export async function getProposals(): Promise<Proposal[]> {
  return fetchJson<Proposal[]>('/council/proposals.json');
}

export async function saveVoteLocally(entry: { proposalId: string; vote: string; actor: string }) {
  const key = 'council-votes';
  const cur = JSON.parse(localStorage.getItem(key) || '[]') as typeof entry[];
  cur.push(entry);
  localStorage.setItem(key, JSON.stringify(cur));
}
