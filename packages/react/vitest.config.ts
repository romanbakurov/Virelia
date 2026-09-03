import path from 'node:path';

import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';

import viteConfig from './vite.config.ts';

export default mergeConfig(
  viteConfig,
  defineConfig({
    resolve: {
      alias: {
        '@vellira-ui/core': path.resolve(
          import.meta.dirname,
          '../core/src/index.ts'
        ),

        '@vellira-ui/icons/native': path.resolve(
          import.meta.dirname,
          '../icons/src/native.ts'
        ),
        '@vellira-ui/icons/lottie': path.resolve(
          import.meta.dirname,
          '../icons/src/lottie.ts'
        ),
        '@vellira-ui/icons/web': path.resolve(
          import.meta.dirname,
          '../icons/src/web.ts'
        ),
        '@vellira-ui/icons': path.resolve(
          import.meta.dirname,
          '../icons/src/web.source.ts'
        ),

        '@vellira-ui/tokens': path.resolve(
          import.meta.dirname,
          '../tokens/src/index.ts'
        ),

        '@vellira-ui/types': path.resolve(
          import.meta.dirname,
          '../types/src/index.ts'
        ),
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
