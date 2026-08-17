import { defineComponentMetadata } from '../defineComponentMetadata';

export const selectMetadata = defineComponentMetadata({
  name: 'Select',
  layer: 'components',
  category: 'form',
  platforms: ['react', 'react-native'],
  profile: 'compound',
  status: 'stable',
  capabilities: [
    'controlled',
    'uncontrolled',
    'disabled',
    'required',
    'invalid',
    'loading',
    'keyboard',
    'focus-management',
    'compound-api',
    'portal',
  ],
  dependencies: {
    packages: ['@vellira-ui/types', '@vellira-ui/core', '@vellira-ui/icons'],
  },
  requirements: {
    tests: true,
    storybook: true,
    docs: true,
    accessibility: true,
  },
});
