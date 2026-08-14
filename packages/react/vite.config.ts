import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import svgr from 'vite-plugin-svgr';

const dirname = import.meta.dirname;

const external = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  'react/jsx-dev-runtime',

  '@vellira-ui/core',
  '@vellira-ui/icons',
  '@vellira-ui/tokens',
  '@vellira-ui/types',

  '@floating-ui/react',
  'clsx',
  'focus-trap',
  'focus-trap-react',
];

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svgr(),
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(dirname, 'src'),
      '@components': path.resolve(dirname, 'src/components'),
      '@patterns': path.resolve(dirname, 'src/patterns'),
      '@primitives': path.resolve(dirname, 'src/primitives'),
      '@styles': path.resolve(dirname, 'src/styles'),
      '@utils': path.resolve(dirname, 'src/utils'),
      '@assets': path.resolve(dirname, 'src/assets'),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        includePaths: [path.resolve(dirname, 'src/styles')],
      },
    },
  },

  build: {
    lib: {
      entry: {
        index: 'src/index.ts',
        styles: 'src/styles.ts',
      },
      name: 'Vellira',
      cssFileName: 'styles',
      fileName: (format, entryName) =>
        format === 'cjs' ? `${entryName}.cjs` : `${entryName}.js`,
      formats: ['es', 'cjs'],
    },

    rolldownOptions: {
      external,
    },
  },
});
