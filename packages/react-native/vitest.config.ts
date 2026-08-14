import path from 'node:path';

import { defineConfig } from 'vitest/config';

const dirname = import.meta.dirname;

export default defineConfig({
  resolve: {
    alias: {
      'react-native': path.resolve(dirname, 'test/react-native.mock.tsx'),
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
        '**/hooks/**',
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
