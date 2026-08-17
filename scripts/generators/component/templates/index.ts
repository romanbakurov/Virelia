export * from './component-types';
export * from './component-story';
export * from './component-native';
export * from './component-web';
export * from './component-styles';
export * from './component-native-styles';
export * from './component-test';
export * from './component-metadata';
export * from './component-readme';
export * from './component-part';
export * from './component-compound';
export * from './component-form-control';

import type { ComponentTemplateParams } from './component-types';

export function renderIndexTemplate({
  componentName,
  parts = [],
}: ComponentTemplateParams) {
  const partExports = parts
    .map((partName) => `export * from './${partName}';`)
    .join('\n');

  return `export * from './${componentName}';
export * from './types';${partExports ? `\n${partExports}` : ''}
`;
}
