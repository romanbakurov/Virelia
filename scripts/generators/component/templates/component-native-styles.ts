import type { ComponentProfileArg, FormControlKindArg } from '../cli';
import type { ComponentTemplateParams } from './component-types';

export type NativeStylesTemplateParams = ComponentTemplateParams & {
  profile?: ComponentProfileArg;
  control?: FormControlKindArg;
};

export function renderNativeStylesTemplate({
  componentName,
  profile = 'base',
  control = 'value',
}: NativeStylesTemplateParams) {
  if (profile === 'form-control' && control === 'boolean') {
    return `import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  root: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
    backgroundColor: '#6b7280',
  },
  checked: {
    backgroundColor: '#2563eb',
  },
  invalid: {
    borderWidth: 2,
    borderColor: '#dc2626',
  },
  disabled: {
    opacity: 0.5,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    transform: [{ translateX: 0 }],
  },
  thumbChecked: {
    transform: [{ translateX: 20 }],
  },
});
`;
  }

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
