import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: [
      {
        find: '@vellira-ui/icons/lottie',
        replacement: path.resolve(
          __dirname,
          '../../packages/icons/src/lottie.ts'
        ),
      },
      {
        find: '@vellira-ui/icons',
        replacement: path.resolve(__dirname, '../../packages/icons/src/web.ts'),
      },
      {
        find: '@components',
        replacement: path.resolve(
          __dirname,
          '../../packages/react/src/components'
        ),
      },
      {
        find: '@patterns',
        replacement: path.resolve(
          __dirname,
          '../../packages/react/src/patterns'
        ),
      },
      {
        find: '@primitives',
        replacement: path.resolve(
          __dirname,
          '../../packages/react/src/primitives'
        ),
      },
      {
        find: '@styles',
        replacement: path.resolve(__dirname, '../../packages/react/src/styles'),
      },
      {
        find: '@utils',
        replacement: path.resolve(__dirname, '../../packages/react/src/utils'),
      },
      {
        find: '@assets',
        replacement: path.resolve(__dirname, '../../packages/react/src/assets'),
      },
      {
        find: '@',
        replacement: path.resolve(__dirname, '../../packages/react/src'),
      },
    ],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@styles/mixins" as *;`,
      },
    },
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
});
