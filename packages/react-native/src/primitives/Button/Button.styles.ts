import { StyleSheet, type TextStyle } from 'react-native';

import type { NativeTheme } from '../../theme';

const fontWeight = (value: string): TextStyle['fontWeight'] =>
  value as TextStyle['fontWeight'];

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderWidth: 1,
    },

    fullWidth: {
      alignSelf: 'stretch',
      width: '100%',
    },

    text: {
      fontFamily: theme.tokens.typography.family.regular,
      fontWeight: fontWeight(theme.tokens.typography.weight.regular),
      lineHeight: theme.tokens.typography.lineHeight.md,

      // Fallback color.
      color: theme.components.button.primary.solid.default.fg,
    },

    labelSlot: {
      position: 'relative',
    },

    labelMeasure: {
      position: 'absolute',
      opacity: 0,
    },

    spinner: {
      fontSize: 12,
      lineHeight: theme.tokens.typography.lineHeight.md,
    },

    badge: {
      minWidth: 18,
      height: 18,
      paddingHorizontal: 6,
      borderRadius: theme.tokens.radius.full,
      overflow: 'hidden',
      textAlign: 'center',
      fontSize: 11,
      lineHeight: 18,
      fontWeight: fontWeight(theme.tokens.typography.weight.medium),
    },

    shortcut: {
      opacity: 0.72,
      fontSize: 12,
    },

    disabled: {
      borderColor: theme.components.button.disabled.border,
    },

    focused: {
      borderColor: theme.semantic.focus.ring.color,
      shadowColor: theme.semantic.focus.ring.color,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.18,
      shadowRadius: 8,
      elevation: 2,
    },

    pressed: {
      transform: [{ scale: 0.98 }],
    },
  });
