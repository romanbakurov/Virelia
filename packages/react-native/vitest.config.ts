import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      'react-native': path.resolve(__dirname, 'test/react-native.mock.tsx'),
      '@vellira-ui/core': path.resolve(__dirname, '../core/src/index.ts'),
      '@vellira-ui/icons': path.resolve(__dirname, 'test/icons.mock.tsx'),
      '@vellira-ui/tokens': path.resolve(__dirname, '../tokens/src/index.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        '**/*.styles.ts',
        '**/*.stories.*',
        '**/*.test.*',
        '**/index.ts',
        '**/types.ts',
        '**/test-utils/**',
        '**/test/**',
      ],
      thresholds: {
        statements: 90,
        branches: 80,
        functions: 90,
        lines: 90,
      },
    },
  },
});
