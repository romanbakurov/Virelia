import type { ComponentMetadata } from '@vellira-ui/metadata';

export const webOnlyMetadata: ComponentMetadata = {
  name: 'WebOnlyFixture',
  layer: 'components',
  category: 'utility',
  platforms: ['react'],
  profile: 'base',
  status: 'stable',
  requirements: {
    tests: true,
    storybook: true,
    docs: true,
    accessibility: true,
  },
};

export const nativeOnlyMetadata: ComponentMetadata = {
  name: 'NativeOnlyFixture',
  layer: 'components',
  category: 'utility',
  platforms: ['react-native'],
  profile: 'base',
  status: 'stable',
  requirements: {
    tests: true,
    storybook: false,
    docs: true,
    accessibility: true,
  },
};

export const crossPlatformMetadata: ComponentMetadata = {
  name: 'CrossPlatformFixture',
  layer: 'components',
  category: 'utility',
  platforms: ['react', 'react-native'],
  profile: 'base',
  status: 'stable',
  requirements: {
    tests: true,
    storybook: true,
    docs: true,
    accessibility: true,
  },
};

export const fixtureMetadataRegistry = [
  webOnlyMetadata,
  nativeOnlyMetadata,
  crossPlatformMetadata,
] as const;

export const malformedMetadata = {
  name: 'MalformedFixture',
};
