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
      width: theme.components.switch.geometry.trackWidth,
      height: theme.components.switch.geometry.trackHeight,
      borderRadius: theme.tokens.radius.full,
      borderWidth: theme.components.switch.geometry.borderWidth,
      padding: theme.components.switch.geometry.padding,
      justifyContent: 'center',
      backgroundColor: theme.components.switch.off.trackBg,
      borderColor: theme.components.switch.off.trackBorder,
    },
    checked: {
      backgroundColor: theme.components.switch.on.default.trackBg,
      borderColor: theme.components.switch.on.default.trackBorder,
    },
    pressed: {
      transform: [{ scale: theme.components.switch.geometry.pressScale }],
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
      width: theme.components.switch.geometry.thumbSize,
      height: theme.components.switch.geometry.thumbSize,
      borderRadius: theme.tokens.radius.full,
      backgroundColor: theme.components.switch.off.thumbBg,
      transform: [{ translateX: 0 }],
    },
    thumbChecked: {
      backgroundColor: theme.components.switch.on.default.thumbBg,
      transform: [
        { translateX: theme.components.switch.geometry.thumbTravel },
      ],
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
