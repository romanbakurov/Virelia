import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/react-vite';
import { mergeConfig } from 'vite';

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  stories: ['../../../packages/react/src/**/*.stories.@(ts|tsx|mdx)'],

  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@chromatic-com/storybook',
  ],

  async viteFinal(config) {
    return mergeConfig(config, {
      resolve: {
        alias: {
          '@vellira-ui/core': path.resolve(
            dirname,
            '../../../packages/core/src/index.ts'
          ),
        },
      },
      build: {
        chunkSizeWarningLimit: 1200,
      },
    });
  },
};

export default config;
