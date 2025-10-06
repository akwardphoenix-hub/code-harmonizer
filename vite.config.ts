import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Use 0.0.0.0 in CI to avoid firewall blocks, 127.0.0.1 locally
const host = process.env.CI ? '0.0.0.0' : '127.0.0.1';

export default defineConfig({
  plugins: [react()],
  server: { host, port: 5173, strictPort: true },
  preview: { host, port: 4173, strictPort: true },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  base: './'
});