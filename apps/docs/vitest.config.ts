import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@vellira-ui/metadata': '../../packages/metadata/src/index.ts',
    },
  },
  test: {
    environment: 'node',
    include: ['src/component-docs/**/*.test.ts'],
  },
});
