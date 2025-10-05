import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import congress from './fixtures/congress.sample.json';
import proposals from './fixtures/council.proposals.json';
import votes from './fixtures/council.votes.json';
import audit from './fixtures/audit.log.json';

export const server = setupServer(
  http.get('/api/congress/:anything', () => HttpResponse.json(congress)),
  http.get('/api/council/proposals', () => HttpResponse.json(proposals)),
  http.get('/api/council/votes', () => HttpResponse.json(votes)),
  http.get('/api/audit', () => HttpResponse.json(audit)),
  http.post('/api/council/vote', async ({ request }) => {
    const payload = await request.json();
    return HttpResponse.json({
      ok: true,
      received: payload,
      id: 'mock-vote',
      createdAt: new Date().toISOString(),
    });
  }),
);
