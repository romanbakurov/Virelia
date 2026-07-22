import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false,
  clean: true,
  sourcemap: false,
  splitting: false,
  platform: 'neutral',
  target: 'es2022',
  deps: {
    neverBundle: [
      'react',
      'react-native',
      '@vellira-ui/core',
      '@vellira-ui/icons',
      '@vellira-ui/tokens',
      '@vellira-ui/types',
    ],
  },
});
