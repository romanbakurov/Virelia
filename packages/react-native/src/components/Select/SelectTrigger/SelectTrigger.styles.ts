import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    trigger: {
      width: '100%',
      minWidth: 0,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      paddingHorizontal: theme.tokens.spacing[4],
      paddingVertical: theme.tokens.spacing[3],
      backgroundColor: theme.components.select.trigger.default.bg,
      borderColor: theme.components.select.trigger.default.border,
      borderRadius: theme.tokens.radius.md,
      borderWidth: 1,
    },

    sm: {
      minHeight: 36,
      paddingHorizontal: theme.tokens.spacing[3],
      paddingVertical: theme.tokens.spacing[2],
    },

    md: {
      minHeight: 44,
      paddingHorizontal: theme.tokens.spacing[4],
      paddingVertical: theme.tokens.spacing[3],
    },

    lg: {
      minHeight: 52,
      paddingHorizontal: theme.tokens.spacing[5],
      paddingVertical: theme.tokens.spacing[4],
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

    triggerOpen: {
      backgroundColor: theme.components.select.trigger.focus.bg,
      borderColor: theme.components.select.trigger.focus.border,
      borderWidth: 2,
    },

    triggerError: {
      borderColor: theme.components.select.trigger.error.border,
    },

    triggerErrorOpen: {
      borderColor: theme.components.select.trigger.error.border,
      shadowColor: theme.components.select.trigger.error.ring,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 1,
    },

    textOpen: {
      color: theme.components.select.trigger.focus.fg,
    },

    triggerDisabled: {
      backgroundColor: theme.components.select.trigger.disabled.bg,
      borderColor: theme.components.select.trigger.disabled.border,
    },

    text: {
      flex: 1,
      minWidth: 0,
      color: theme.components.select.trigger.default.fg,
      fontFamily: theme.tokens.typography.family.regular,
    },

    textDisabled: {
      color: theme.components.select.trigger.disabled.fg,
    },

    placeholder: {
      color: theme.components.select.trigger.placeholder.fg,
    },

    icon: {
      width: 16,
      height: 16,
      marginLeft: theme.tokens.spacing[2],
      alignItems: 'center',
      justifyContent: 'center',
    },

    iconOpen: {
      transform: [{ rotate: '180deg' }],
    },
  });
