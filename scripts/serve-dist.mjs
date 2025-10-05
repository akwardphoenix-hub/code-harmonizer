import http from 'http';
import serveHandler from 'serve-handler';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, '..', 'dist');

const server = http.createServer((req, res) => {
  return serveHandler(req, res, {
    public: dist,
    cleanUrls: true,
    rewrites: [{ source: '**', destination: '/index.html' }]
  });
});

const PORT = 4173;
// Use 0.0.0.0 in CI to avoid firewall blocks, 127.0.0.1 locally
const HOST = process.env.CI ? '0.0.0.0' : '127.0.0.1';

server.listen(PORT, HOST, () => {
  console.log(`Serving dist at http://${HOST}:${PORT}`);
});
