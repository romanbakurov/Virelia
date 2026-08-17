import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['scripts/**/*.test.ts', 'scripts/**/*.test.tsx'],
    exclude: ['scripts/**/*.e2e.test.ts', 'node_modules/**'],
  },
});
