import { defineComponentMetadata } from '@vellira-ui/metadata';

export const switchMetadata = defineComponentMetadata({
  name: 'Switch',
  layer: 'primitives',
  category: 'form',
  platforms: ['react', 'react-native'],
  profile: 'form-control',
  status: 'experimental',
  capabilities: [
    'controlled',
    'uncontrolled',
    'disabled',
    'required',
    'invalid',
  ],
  requirements: {
    tests: true,
    storybook: true,
    docs: true,
    accessibility: true,
  },
});
