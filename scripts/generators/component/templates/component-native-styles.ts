import type { ComponentTemplateParams } from './component-types';

export function renderNativeStylesTemplate({
  componentName,
}: ComponentTemplateParams) {
  const className = `${componentName[0].toLowerCase()}${componentName.slice(1)}`;

  return `import { theme } from '@@vellira-ui/tokens';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  ${className}: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
  },
});
`;
}
