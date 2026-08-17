import type { ComponentTemplateParams } from './component-types';

export type MetadataTemplateParams = ComponentTemplateParams & {
  layer: 'primitives' | 'components' | 'patterns';
  category:
    | 'action'
    | 'form'
    | 'navigation'
    | 'overlay'
    | 'feedback'
    | 'data-display'
    | 'layout'
    | 'utility';
  platforms: readonly ('react' | 'react-native')[];
  profile: 'base' | 'form-control' | 'compound' | 'overlay';
};

export function renderMetadataTemplate({
  componentName,
  layer,
  category,
  platforms,
  profile,
}: MetadataTemplateParams) {
  const metadataName = `${componentName[0].toLowerCase()}${componentName.slice(1)}Metadata`;

  return `import { defineComponentMetadata } from '@vellira-ui/metadata';

export const ${metadataName} = defineComponentMetadata({
  name: '${componentName}',
  layer: '${layer}',
  category: '${category}',
  platforms: [${platforms.map((platform) => `'${platform}'`).join(', ')}],
  profile: '${profile}',
  status: 'experimental',
  capabilities: [],
  requirements: {
    tests: true,
    storybook: true,
    docs: true,
    accessibility: true,
  },
});
`;
}
