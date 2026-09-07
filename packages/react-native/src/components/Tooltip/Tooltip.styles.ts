import { Platform, StyleSheet } from 'react-native';

import {
  type NativeTheme,
  resolveComponentTokenPlatformOutputs,
} from '../../theme';

export const createStyles = (theme: NativeTheme) => {
  const canonical = theme.components.tooltip.content;
  const output = resolveComponentTokenPlatformOutputs(theme, canonical);
  const nativeShadow = output.reactNative.shadow;

  return StyleSheet.create({
    root: {
      alignSelf: Platform.select({
        web: 'auto',
        default: 'flex-start',
      }),
    },

    overlay: {
      ...StyleSheet.absoluteFill,
    },

    bubble: {
      position: 'absolute',
      maxWidth: canonical.maxWidth,

      paddingHorizontal: canonical.paddingX,
      paddingVertical: canonical.paddingY,

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

    text: {
      flexShrink: 1,
      color: canonical.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: canonical.fontSize,
      lineHeight: canonical.lineHeight,
      textAlign: 'center',
    },
  });
};
