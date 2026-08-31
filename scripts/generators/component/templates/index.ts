export * from './component-types';
export * from './component-story';
export * from './component-native';
export * from './component-web';
export * from './component-styles';
export * from './component-native-styles';
export * from './component-test';
export * from './component-metadata';
export * from './component-part';
export * from './component-compound';
export * from './component-form-control';
export * from './component-overlay-web';
export * from './component-overlay-native';
export * from './component-overlay-part-native';
export * from './component-overlay-part-web';
export * from './component-tokens';

import type { ComponentTemplateParams } from './component-types';

export function renderIndexTemplate({
  componentName,
  parts = [],
}: ComponentTemplateParams) {
  const exportPaths = [
    `./${componentName}`,
    ...parts.map((partName) => `./${partName}`),
    './types',
  ].sort((left, right) =>
    left.localeCompare(right, 'en', { sensitivity: 'base' })
  );

  return `${exportPaths
    .map((exportPath) => `export * from '${exportPath}';`)
    .join('\n')}
`;
}
