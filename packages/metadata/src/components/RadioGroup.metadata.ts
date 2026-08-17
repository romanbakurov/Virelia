import { defineComponentMetadata } from '../defineComponentMetadata';

export const radioGroupMetadata = defineComponentMetadata({
  name: 'RadioGroup',
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
    'keyboard',
    'compound-api',
  ],
  dependencies: {
    packages: ['@vellira-ui/types', '@vellira-ui/tokens'],
    components: ['Radio'],
  },
  requirements: {
    tests: true,
    storybook: true,
    docs: true,
    accessibility: true,
  },
});
