import path from 'node:path';

import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';

import viteConfig from './vite.config';

export default mergeConfig(
  viteConfig,
  defineConfig({
    resolve: {
      alias: {
        '@vellira-ui/core': path.resolve(__dirname, '../core/src/index.ts'),
      },
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./vitest.setup.ts'],
      isolate: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html'],
        exclude: [
          '**/*.module.scss',
          '**/*.stories.*',
          '**/*.test.*',
          '**/hooks/**',
          '**/index.ts',
          '**/types.ts',
          '**/test-utils/**',
        ],
        thresholds: {
          statements: 90,
          branches: 80,
          functions: 90,
          lines: 90,
        },
      },
    },
  })
);
