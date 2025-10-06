import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Always use 127.0.0.1 for offline-first approach
const host = '127.0.0.1';

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