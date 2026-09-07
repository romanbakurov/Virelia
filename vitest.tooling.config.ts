import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const websiteReact = fileURLToPath(
  new URL('./apps/website/node_modules/react', import.meta.url)
);
const websiteReactDom = fileURLToPath(
  new URL('./apps/website/node_modules/react-dom', import.meta.url)
);

export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@': fileURLToPath(new URL('./apps/website/src', import.meta.url)),
      react: websiteReact,
      'react-dom': websiteReactDom,
    },
  },
  test: {
    environment: 'node',
    include: ['scripts/**/*.test.ts', 'scripts/**/*.test.tsx'],
    exclude: ['scripts/**/*.e2e.test.ts', 'node_modules/**'],
    server: {
      deps: {
        inline: [/@testing-library\/react/, /\/react-dom\//, /\/react\//],
      },
    },
  },
});
