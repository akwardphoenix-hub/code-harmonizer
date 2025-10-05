import { DATA_BASE } from '../lib/config';

export type Proposal = {
  id: string;
  title: string;
  description?: string;
  createdAt: string; // ISO
  votingEndsAt?: string; // ISO
};

export async function getProposals(): Promise<Proposal[]> {
  // Always local fixtures to avoid network flake
  const res = await fetch(`${DATA_BASE}/council-proposals.json`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load proposals');
  return res.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveVoteLocally(entry: any) {
  // In dev: mirror to localStorage to keep tests hermetic
  const key = 'council-votes';
  const cur = JSON.parse(localStorage.getItem(key) || '[]');
  cur.push(entry);
  localStorage.setItem(key, JSON.stringify(cur));
}
