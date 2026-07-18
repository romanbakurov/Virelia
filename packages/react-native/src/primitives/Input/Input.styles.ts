import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../theme';

export const getPlaceholderTextColor = (theme: NativeTheme) =>
  theme.components.input.default.placeholder;

export const getFocusedPlaceholderTextColor = (theme: NativeTheme) =>
  theme.components.input.focus.placeholder;

export const getDisabledPlaceholderTextColor = (theme: NativeTheme) =>
  theme.components.input.disabled.placeholder;

export const getReadOnlyPlaceholderTextColor = (theme: NativeTheme) =>
  theme.components.input.readOnly.placeholder;

const resolveRingColor = (ring: string | { color: string }): string =>
  typeof ring === 'string' ? ring : ring.color;

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

    inputWithLeftAdornment: {
      paddingLeft: theme.tokens.spacing[5] + 20,
    },

    inputWithRightAdornment: {
      paddingRight: theme.tokens.spacing[5] + 20,
    },

    rightIcon: {
      position: 'absolute',
      right: theme.tokens.spacing[4],
      top: '50%',
      zIndex: 1,
      width: 20,
      height: 20,
      marginTop: -10,
      alignItems: 'center',
      justifyContent: 'center',
    },

    leftIcon: {
      position: 'absolute',
      left: theme.tokens.spacing[4],
      top: '50%',
      zIndex: 1,
      width: 20,
      height: 20,
      marginTop: -10,
      alignItems: 'center',
      justifyContent: 'center',
    },

    clearButton: {
      position: 'absolute',
      right: theme.tokens.spacing[4],
      top: '50%',
      zIndex: 1,
      width: 20,
      height: 20,
      marginTop: -10,
      borderRadius: theme.tokens.radius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },

    revealButton: {
      position: 'absolute',
      right: theme.tokens.spacing[3],
      top: '50%',
      zIndex: 1,
      minWidth: 40,
      height: 28,
      marginTop: -14,
      borderRadius: theme.tokens.radius.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },

    revealButtonText: {
      color: theme.components.input.icon.muted,
      fontFamily: theme.tokens.typography.family.medium,
      fontSize: theme.tokens.typography.size.xs,
      lineHeight: theme.tokens.typography.lineHeight.xs,
    },

    clearButtonText: {
      color: theme.components.input.clearButton.fg,
      fontSize: 16,
      lineHeight: 20,
    },

    clearButtonPressed: {
      backgroundColor: theme.components.input.clearButton.pressedBg,
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

    focused: {
      color: theme.components.input.focus.fg,
      backgroundColor: theme.components.input.focus.bg,
      borderColor: theme.components.input.focus.border,
      shadowColor: resolveRingColor(theme.components.input.focus.ring),
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.18,
      shadowRadius: 6,
      elevation: 1,
    },

    error: {
      borderColor: theme.components.input.error.border,
    },

    errorFocused: {
      borderColor: theme.components.input.error.border,
      shadowColor: resolveRingColor(theme.components.input.error.ring),
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 1,
    },

    readOnly: {
      color: theme.components.input.readOnly.fg,
      borderColor: theme.components.input.readOnly.border,
      backgroundColor: theme.components.input.readOnly.bg,
    },

    disabled: {
      opacity: 1,
      color: theme.components.input.disabled.fg,
      backgroundColor: theme.components.input.disabled.bg,
      borderColor: theme.components.input.disabled.border,
    },
  });
