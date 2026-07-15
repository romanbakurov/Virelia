import { StyleSheet } from 'react-native';

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
      zIndex: 1000,
      maxWidth: 280,

      paddingHorizontal: theme.tokens.spacing[3],
      paddingVertical: theme.tokens.spacing[2],

      backgroundColor: theme.components.tooltip.content.bg,
      borderColor: theme.components.tooltip.content.border,
      borderRadius: theme.tokens.radius.sm,
      borderWidth: 1,

      shadowColor: theme.tokens.shadows.md.color,
      shadowOffset: {
        width: theme.tokens.shadows.md.x,
        height: theme.tokens.shadows.md.y,
      },
      shadowOpacity: theme.tokens.shadows.md.opacity,
      shadowRadius: theme.tokens.shadows.md.blur,
      elevation: theme.tokens.shadows.md.elevation,
    },

    text: {
      flexShrink: 1,
      color: theme.components.tooltip.content.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.sm,
      lineHeight: theme.tokens.typography.lineHeight.sm,
      textAlign: 'center',
    },
  });
