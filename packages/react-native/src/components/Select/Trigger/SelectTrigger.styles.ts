import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createTriggerStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    trigger: {
      width: '100%',
      minWidth: 0,
      minHeight: 44,
      alignItems: 'center',
      flexDirection: 'row',
      borderRadius: theme.tokens.radius.md,
      borderWidth: 1,
    },

    sm: {
      minHeight: 44,
      paddingHorizontal: theme.tokens.spacing[3],
      paddingVertical: theme.tokens.spacing[2],
    },

    md: {
      minHeight: 46,
      paddingHorizontal: theme.tokens.spacing[4],
      paddingVertical: theme.tokens.spacing[3],
    },

    lg: {
      minHeight: 52,
      paddingHorizontal: theme.tokens.spacing[5],
      paddingVertical: theme.tokens.spacing[4],
    },

    value: {
      flex: 1,
      minWidth: 0,
    },

    text: {
      fontFamily: theme.tokens.typography.family.regular,
    },

    textSm: {
      fontSize: theme.tokens.typography.size.sm,
      lineHeight: theme.tokens.typography.lineHeight.sm,
    },

    textMd: {
      fontSize: theme.tokens.typography.size.md,
      lineHeight: theme.tokens.typography.lineHeight.md,
    },

    textLg: {
      fontSize: theme.tokens.typography.size.lg,
      lineHeight: theme.tokens.typography.lineHeight.lg,
    },

    affix: {
      flexShrink: 0,
      color: theme.semantic.text.secondary,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.md,
      lineHeight: theme.tokens.typography.lineHeight.md,
    },

    startIcon: {
      width: 18,
      height: 18,
      marginRight: theme.tokens.spacing[2],
      alignItems: 'center',
      justifyContent: 'center',
    },

    endIcon: {
      width: 18,
      height: 18,
      marginLeft: theme.tokens.spacing[2],
      alignItems: 'center',
      justifyContent: 'center',
    },

    iconOpen: {
      transform: [{ rotate: '180deg' }],
    },

    clearButton: {
      width: 28,
      height: 28,
      marginLeft: theme.tokens.spacing[2],
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 999,
      backgroundColor: theme.semantic.status.error.bg,
    },
  });
