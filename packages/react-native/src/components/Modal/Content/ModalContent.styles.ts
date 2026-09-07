import { type DimensionValue, Platform, StyleSheet } from 'react-native';

import {
  type NativeTheme,
  resolveComponentTokenPlatformOutputs,
} from '../../../theme';

export const createStyles = (theme: NativeTheme) => {
  const canonical = theme.components.modal.content;
  const output = resolveComponentTokenPlatformOutputs(theme, canonical);
  const nativeShadow = output.reactNative.shadow;

  return StyleSheet.create({
    content: {
      width: '100%',
      maxWidth: canonical.size.md,
      maxHeight: Platform.select({
        web: output.web.maxHeight as DimensionValue,
        default: output.reactNative.maxHeight as DimensionValue,
      }),
      padding: canonical.padding,
      gap: canonical.gap,

      backgroundColor: canonical.bg,
      borderColor: canonical.border,
      borderRadius: canonical.radius,
      borderWidth: canonical.borderWidth,

      ...Platform.select({
        web: {
          boxShadow: output.web.shadow,
        },
        default: {
          shadowColor: nativeShadow.color,
          shadowOffset: {
            width: nativeShadow.x,
            height: nativeShadow.y,
          },
          shadowOpacity: nativeShadow.opacity,
          shadowRadius: nativeShadow.blur,
          elevation: nativeShadow.elevation,
        },
      }),
    },
  });
};
