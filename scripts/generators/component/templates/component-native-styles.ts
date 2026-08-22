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

import type { NativeTheme } from '../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    root: {
      width: 44,
      height: 24,
      borderRadius: theme.tokens.radius.full,
      borderWidth: 2,
      padding: 1,
      justifyContent: 'center',
      backgroundColor: theme.components.checkbox.default.bg,
      borderColor: theme.components.checkbox.default.border,
    },
    checked: {
      backgroundColor: theme.components.checkbox.primary.default.bg,
      borderColor: theme.components.checkbox.primary.default.border,
    },
    pressed: {
      transform: [{ scale: 0.98 }],
    },
    checkedPressed: {
      backgroundColor: theme.components.checkbox.primary.pressed.bg,
      borderColor: theme.components.checkbox.primary.pressed.border,
    },
    invalid: {
      borderColor: theme.components.checkbox.error.border,
    },
    disabled: {
      backgroundColor: theme.components.checkbox.disabled.bg,
      borderColor: theme.components.checkbox.disabled.border,
    },
    thumb: {
      width: 18,
      height: 18,
      borderRadius: theme.tokens.radius.full,
      backgroundColor: theme.components.checkbox.default.fg,
      transform: [{ translateX: 0 }],
    },
    thumbChecked: {
      backgroundColor: theme.components.checkbox.primary.default.fg,
      transform: [{ translateX: 20 }],
    },
    thumbCheckedPressed: {
      backgroundColor: theme.components.checkbox.primary.pressed.fg,
    },
    thumbDisabled: {
      backgroundColor: theme.components.checkbox.disabled.fg,
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
