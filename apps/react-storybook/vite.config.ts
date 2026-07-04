import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../../packages/react/src'),
      '@components': path.resolve(
        __dirname,
        '../../packages/react/src/components'
      ),
      '@hooks': path.resolve(__dirname, '../../packages/react/src/hooks'),
      '@overlay': path.resolve(__dirname, '../../packages/react/src/overlay'),
      '@patterns': path.resolve(__dirname, '../../packages/react/src/patterns'),
      '@primitives': path.resolve(
        __dirname,
        '../../packages/react/src/primitives'
      ),
      '@styles': path.resolve(__dirname, '../../packages/react/src/styles'),
      '@utils': path.resolve(__dirname, '../../packages/react/src/utils'),
      '@assets': path.resolve(__dirname, '../../packages/react/src/assets'),
    },
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
