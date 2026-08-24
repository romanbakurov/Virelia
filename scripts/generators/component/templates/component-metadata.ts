import type { ComponentCapability } from '@vellira-ui/metadata';
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
  capabilities: readonly ComponentCapability[];
};

export function renderMetadataTemplate({
  componentName,
  layer,
  category,
  platforms,
  profile,
  capabilities,
}: MetadataTemplateParams) {
  const metadataName = `${componentName[0].toLowerCase()}${componentName.slice(1)}Metadata`;
  const capabilitiesText =
    capabilities.length === 0
      ? '[]'
      : `[
${capabilities.map((capability) => `    '${capability}',`).join('\n')}
  ]`;

  return `import { defineComponentMetadata } from '../defineComponentMetadata';

export const ${metadataName} = defineComponentMetadata({
  name: '${componentName}',
  layer: '${layer}',
  category: '${category}',
  platforms: [${platforms.map((platform) => `'${platform}'`).join(', ')}],
  profile: '${profile}',
  status: 'experimental',
  capabilities: ${capabilitiesText},
  requirements: {
    tests: true,
    storybook: true,
    docs: true,
    accessibility: true,
  },
});
`;
}
