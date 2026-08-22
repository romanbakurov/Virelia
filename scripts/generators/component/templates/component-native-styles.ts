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
      backgroundColor: theme.components.switch.off.trackBg,
      borderColor: theme.components.switch.off.trackBorder,
    },
    checked: {
      backgroundColor: theme.components.switch.on.default.trackBg,
      borderColor: theme.components.switch.on.default.trackBorder,
    },
    pressed: {
      transform: [{ scale: 0.98 }],
    },
    checkedPressed: {
      backgroundColor: theme.components.switch.on.pressed.trackBg,
      borderColor: theme.components.switch.on.pressed.trackBorder,
    },
    invalid: {
      borderColor: theme.components.switch.errorBorder,
    },
    disabled: {
      backgroundColor: theme.components.switch.disabled.trackBg,
      borderColor: theme.components.switch.disabled.trackBorder,
    },
    thumb: {
      width: 18,
      height: 18,
      borderRadius: theme.tokens.radius.full,
      backgroundColor: theme.components.switch.off.thumbBg,
      transform: [{ translateX: 0 }],
    },
    thumbChecked: {
      backgroundColor: theme.components.switch.on.default.thumbBg,
      transform: [{ translateX: 20 }],
    },
    thumbCheckedPressed: {
      backgroundColor: theme.components.switch.on.pressed.thumbBg,
    },
    thumbDisabled: {
      backgroundColor: theme.components.switch.disabled.thumbBg,
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
