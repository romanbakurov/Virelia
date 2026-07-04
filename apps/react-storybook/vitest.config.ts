import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vitest/config';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

const require = createRequire(import.meta.url);
const webSrc = path.resolve(dirname, '../../packages/react/src');

export default defineConfig({
  resolve: {
    alias: {
      '@': webSrc,
      '@components': path.resolve(webSrc, 'components'),
      '@hooks': path.resolve(webSrc, 'hooks'),
      '@overlay': path.resolve(webSrc, 'overlay'),
      '@patterns': path.resolve(webSrc, 'patterns'),
      '@primitives': path.resolve(webSrc, 'primitives'),
      '@styles': path.resolve(webSrc, 'styles'),
      '@utils': path.resolve(webSrc, 'utils'),
      '@assets': path.resolve(webSrc, 'assets'),
      'storybook/test': require.resolve('storybook/test'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@styles/mixins" as *;',
      },
    },
  },
  optimizeDeps: {
    include: [
      '@floating-ui/react',
      'clsx',
      'focus-trap-react',
      'storybook/test',
    ],
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          react(),
          svgr(),
          storybookTest({ configDir: path.join(dirname, '.storybook') }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
