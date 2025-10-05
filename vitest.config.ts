import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    coverage: {
      enabled: false
    },
    watch: false,
    exclude: ['node_modules', 'dist', 'e2e/**'],
  },
});
