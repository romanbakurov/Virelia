import { defineComponentMetadata } from '../defineComponentMetadata';

export const formFieldMetadata = defineComponentMetadata({
  name: 'FormField',
  layer: 'patterns',
  category: 'form',
  platforms: ['react', 'react-native'],
  status: 'stable',
  capabilities: ['disabled', 'required', 'invalid', 'compound-api'],
  dependencies: {
    packages: ['@vellira-ui/types'],
  },
  requirements: {
    tests: true,
    storybook: true,
    docs: true,
    accessibility: true,
  },
});
