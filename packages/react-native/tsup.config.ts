import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: false,
  clean: true,
  sourcemap: false,
  splitting: false,
  external: [
    'react',
    'react-native',
    '@react-native-picker/picker',
    '@vellira-ui/core',
    '@vellira-ui/icons',
    '@vellira-ui/tokens',
    '@vellira-ui/types',
  ],
});
