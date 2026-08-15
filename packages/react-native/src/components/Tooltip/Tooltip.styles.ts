import { Platform, StyleSheet } from 'react-native';

import type { NativeTheme } from '../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    root: {
      alignSelf: 'flex-start',
    },

    overlay: {
      ...StyleSheet.absoluteFill,
    },

    bubble: {
      position: 'absolute',
      maxWidth: theme.components.tooltip.content.maxWidth,

      paddingHorizontal: theme.components.tooltip.content.paddingX,
      paddingVertical: theme.components.tooltip.content.paddingY,

      backgroundColor: theme.components.tooltip.content.bg,
      borderColor: theme.components.tooltip.content.border,
      borderRadius: theme.components.tooltip.content.radius,
      borderWidth: theme.components.tooltip.content.borderWidth,

      ...Platform.select({
        web: {
          boxShadow: theme.components.tooltip.content.shadow,
        },
        default: {
          shadowColor: theme.tokens.shadows.md.color,
          shadowOffset: {
            width: theme.tokens.shadows.md.x,
            height: theme.tokens.shadows.md.y,
          },
          shadowOpacity: theme.tokens.shadows.md.opacity,
          shadowRadius: theme.tokens.shadows.md.blur,
          elevation: theme.tokens.shadows.md.elevation,
        },
      }),
    },

    text: {
      flexShrink: 1,
      color: theme.components.tooltip.content.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.components.tooltip.content.fontSize,
      lineHeight: theme.components.tooltip.content.lineHeight,
      textAlign: 'center',
    },
  });
