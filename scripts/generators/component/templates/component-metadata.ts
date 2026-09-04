import type {
  ComponentCapability,
  ComponentIconRequirement,
} from '@vellira-ui/metadata';
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
  icons?: readonly ComponentIconRequirement[];
  tokens?: readonly string[];
};

function renderSingleQuotedString(value: string) {
  return `'${value
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')}'`;
}

export function renderMetadataTemplate({
  componentName,
  layer,
  category,
  platforms,
  profile,
  capabilities,
  icons = [],
  tokens = [],
}: MetadataTemplateParams) {
  const metadataName = `${componentName[0].toLowerCase()}${componentName.slice(1)}Metadata`;
  const capabilitiesText =
    capabilities.length === 0
      ? '[]'
      : `[
${capabilities.map((capability) => `    '${capability}',`).join('\n')}
  ]`;
  const resourceRequirementsText = [
    icons.length === 0
      ? null
      : `    icons: [
${icons
  .map(
    (icon) => `      {
        name: ${renderSingleQuotedString(icon.name)},
        purpose: ${renderSingleQuotedString(icon.purpose)},
      },`
  )
  .join('\n')}
    ],`,
    tokens.length === 0
      ? null
      : `    tokens: [${tokens.map(renderSingleQuotedString).join(', ')}],`,
  ]
    .filter(Boolean)
    .join('\n');

  const requirementsSuffix =
    resourceRequirementsText.length > 0 ? `\n${resourceRequirementsText}` : '';

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
    accessibility: true,${requirementsSuffix}
  },
});
`;
}
