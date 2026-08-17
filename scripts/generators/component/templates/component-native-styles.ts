import type { ComponentTemplateParams } from './component-types';

export function renderNativeStylesTemplate({
  componentName,
}: ComponentTemplateParams) {
  const className = `${componentName[0].toLowerCase()}${componentName.slice(1)}`;

  return `import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  ${className}: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
`;
}
