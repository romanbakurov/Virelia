import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../theme';

export const getPlaceholderTextColor = (theme: NativeTheme) =>
  theme.components.input.default.placeholder;

export const getDisabledPlaceholderTextColor = (theme: NativeTheme) =>
  theme.components.input.disabled.placeholder;

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    inputWrapper: {
      position: 'relative',
      width: '100%',
      minWidth: 0,
      alignSelf: 'stretch',
    },

    input: {
      width: '100%',
      minWidth: 0,
      alignSelf: 'stretch',

      color: theme.components.input.default.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.md,
      backgroundColor: theme.components.input.default.bg,
      borderColor: theme.components.input.default.border,
      borderRadius: theme.tokens.radius.md,
      borderWidth: 1,
    },

    inputWithLeftIcon: {
      paddingLeft: theme.tokens.spacing[5] + 20,
    },

    leftIcon: {
      position: 'absolute',
      left: theme.tokens.spacing[4],
      top: 0,
      bottom: 0,
      zIndex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    sm: {
      minHeight: 36,
      paddingHorizontal: theme.tokens.spacing[3],
      paddingVertical: theme.tokens.spacing[2],
      fontSize: theme.tokens.typography.size.sm,
    },

    md: {
      minHeight: 44,
      paddingHorizontal: theme.tokens.spacing[4],
      paddingVertical: theme.tokens.spacing[3],
      fontSize: theme.tokens.typography.size.md,
    },

    lg: {
      minHeight: 52,
      paddingHorizontal: theme.tokens.spacing[5],
      paddingVertical: theme.tokens.spacing[4],
      fontSize: theme.tokens.typography.size.lg,
    },

    error: {
      borderColor: theme.components.input.error.border,
    },

    focused: {
      color: theme.components.input.focus.fg,
      backgroundColor: theme.components.input.focus.bg,
      borderColor: theme.components.input.focus.border,
    },

    errorFocused: {
      borderColor: theme.components.input.error.border,
    },

    disabled: {
      opacity: 1,
      color: theme.components.input.disabled.fg,
      backgroundColor: theme.components.input.disabled.bg,
      borderColor: theme.components.input.disabled.border,
    },
  });
