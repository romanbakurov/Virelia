import { Platform, StyleSheet } from 'react-native';

import {
  type NativeTheme,
  resolveComponentTokenPlatformOutputs,
} from '../../../theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    ...(Platform.OS === 'web'
      ? {
          pointerEvents: 'box-none',
        }
      : {}),
  },

  backdrop: StyleSheet.absoluteFill,

  content: {
    position: 'absolute',
  },
});

export function createPopoverContentStyles(theme: NativeTheme) {
  const canonical = theme.components.popover.content;
  const output = resolveComponentTokenPlatformOutputs(theme, canonical);
  const nativeShadow = output.reactNative.shadow;

  return StyleSheet.create({
    content: {
      minWidth: canonical.minWidth,
      maxWidth: canonical.maxWidth,
      padding: canonical.padding,
      gap: canonical.gap,

      backgroundColor: canonical.bg,
      borderColor: canonical.border,
      borderWidth: canonical.borderWidth,
      borderRadius: canonical.radius,

      ...(Platform.OS === 'web'
        ? {
            boxShadow: output.web.shadow,
          }
        : {
            shadowColor: nativeShadow.color,
            shadowOpacity: nativeShadow.opacity,
            shadowRadius: nativeShadow.blur,
            shadowOffset: {
              width: nativeShadow.x,
              height: nativeShadow.y,
            },
            elevation: nativeShadow.elevation,
          }),
    },
  });
}
