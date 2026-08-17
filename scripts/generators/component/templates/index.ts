export * from './component-types';
export * from './component-story';
export * from './component-native';
export * from './component-web';
export * from './component-styles';
export * from './component-native-styles';
export * from './component-test';
export * from './component-metadata';
export * from './component-readme';

import type { ComponentTemplateParams } from './component-types';

export function renderIndexTemplate({
  componentName,
}: ComponentTemplateParams) {
  return `export * from './${componentName}';
export * from './types';
`;
}
