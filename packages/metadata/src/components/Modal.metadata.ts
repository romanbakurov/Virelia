import { defineComponentMetadata } from '../defineComponentMetadata';

export const modalMetadata = defineComponentMetadata({
  name: 'Modal',
  layer: 'components',
  category: 'overlay',
  platforms: ['react', 'react-native'],
  status: 'stable',
  capabilities: [
    'controlled',
    'uncontrolled',
    'keyboard',
    'focus-management',
    'compound-api',
    'portal',
  ],
  dependencies: {
    packages: ['@vellira-ui/types', '@vellira-ui/tokens', '@vellira-ui/icons'],
  },
  requirements: {
    tests: true,
    storybook: true,
    docs: true,
    accessibility: true,
  },
});
