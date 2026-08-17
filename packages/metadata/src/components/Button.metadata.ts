import { defineComponentMetadata } from '../defineComponentMetadata';

export const buttonMetadata = defineComponentMetadata({
  name: 'Button',
  layer: 'primitives',
  category: 'action',
  platforms: ['react', 'react-native'],
  profile: 'base',
  status: 'stable',
  capabilities: ['disabled', 'loading'],
  dependencies: {
    packages: ['@vellira-ui/types', '@vellira-ui/tokens'],
  },
  requirements: {
    tests: true,
    storybook: true,
    docs: true,
    accessibility: true,
  },
});
