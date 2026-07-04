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

      backgroundColor: theme.components.tooltip.content.bg,
      borderColor: theme.components.tooltip.content.border,
      borderRadius: theme.tokens.radius.sm,
      borderWidth: 1,

      paddingHorizontal: theme.tokens.spacing[3],
      paddingVertical: theme.tokens.spacing[2],

      shadowColor: theme.tokens.shadows.sm.color,
      shadowOffset: {
        width: theme.tokens.shadows.sm.x,
        height: theme.tokens.shadows.sm.y,
      },
      shadowOpacity: theme.tokens.shadows.sm.opacity,
      shadowRadius: theme.tokens.shadows.sm.blur,

      elevation: theme.tokens.shadows.sm.elevation,
    },

    text: {
      color: theme.components.tooltip.content.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.sm,
      lineHeight: 20,
      textAlign: 'center',
    },
  });
