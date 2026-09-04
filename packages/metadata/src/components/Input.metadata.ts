import { defineComponentMetadata } from '../defineComponentMetadata';

export const inputMetadata = defineComponentMetadata({
  name: 'Input',
  layer: 'primitives',
  category: 'form',
  platforms: ['react', 'react-native'],
  profile: 'form-control',
  status: 'stable',
  capabilities: [
    'controlled',
    'uncontrolled',
    'disabled',
    'required',
    'invalid',
  ],
  dependencies: {
    packages: ['@vellira-ui/types', '@vellira-ui/tokens'],
  },
  requirements: {
    tests: true,
    storybook: true,
    docs: true,
    accessibility: true,
    icons: [
      {
        name: 'Close',
        purpose: 'clear input action',
      },
    ],
  },
});
