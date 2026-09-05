import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false,
  clean: true,
  sourcemap: false,
  platform: 'neutral',
  target: 'es2022',
  outputOptions: {
    codeSplitting: false,
  },
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
