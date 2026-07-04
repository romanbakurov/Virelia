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
      borderRadius: theme.tokens.radius.md,
      borderWidth: 0,
    },

    fullWidth: {
      alignSelf: 'stretch',
      width: '100%',
    },

    text: {
      fontFamily: theme.tokens.typography.family.regular,
      fontWeight: fontWeight(theme.tokens.typography.weight.regular),
      lineHeight: theme.tokens.typography.lineHeight.md,

      // Кнопка сама задает цвет текста через props,
      // поэтому это значение используется как fallback.
      color: theme.components.button.primary.default.fg,
    },

    disabled: {
      borderColor: theme.components.button.disabled.border,
      borderWidth: 1,
    },

    pressed: {
      transform: [{ scale: 0.98 }],
    },
  });
