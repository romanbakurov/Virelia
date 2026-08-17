import { defineComponentMetadata } from '../defineComponentMetadata';

export const dropdownMetadata = defineComponentMetadata({
  name: 'Dropdown',
  layer: 'components',
  category: 'overlay',
  platforms: ['react', 'react-native'],
  profile: 'overlay',
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
    packages: ['@vellira-ui/types', '@vellira-ui/tokens'],
  },
  requirements: {
    tests: true,
    storybook: true,
    docs: true,
    accessibility: true,
  },
});
