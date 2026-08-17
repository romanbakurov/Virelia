import { defineComponentMetadata } from '../defineComponentMetadata';

export const tabsMetadata = defineComponentMetadata({
  name: 'Tabs',
  layer: 'components',
  category: 'navigation',
  platforms: ['react', 'react-native'],
  profile: 'compound',
  status: 'stable',
  capabilities: [
    'controlled',
    'uncontrolled',
    'keyboard',
    'focus-management',
    'compound-api',
  ],
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
