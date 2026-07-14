import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    trigger: {
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      gap: theme.tokens.spacing[2],
      backgroundColor: theme.components.dropdown.trigger.default.bg,
      borderColor: theme.components.dropdown.trigger.default.border,
      borderRadius: theme.tokens.radius.lg,
      borderWidth: 2,
    },

    sm: {
      minWidth: 36,
      minHeight: 36,
      paddingHorizontal: theme.tokens.spacing[3],
      paddingVertical: theme.tokens.spacing[2],
    },

    md: {
      minWidth: 44,
      minHeight: 44,
      paddingHorizontal: theme.tokens.spacing[4],
      paddingVertical: theme.tokens.spacing[3],
    },

    lg: {
      minWidth: 52,
      minHeight: 52,
      paddingHorizontal: theme.tokens.spacing[5],
      paddingVertical: theme.tokens.spacing[4],
    },

    iconOnly: {
      borderRadius: theme.tokens.radius.full,
    },

    smIconOnly: {
      width: 36,
      height: 36,
      padding: theme.tokens.spacing[2],
    },

    mdIconOnly: {
      width: 44,
      height: 44,
      padding: theme.tokens.spacing[3],
    },

    lgIconOnly: {
      width: 52,
      height: 52,
      padding: theme.tokens.spacing[4],
    },

    triggerDisabled: {
      backgroundColor: theme.components.dropdown.trigger.disabled.bg,
      borderColor: theme.components.dropdown.trigger.disabled.border,
      borderStyle: 'dashed',
    },

    triggerPressed: {
      backgroundColor: theme.components.dropdown.trigger.hover.bg,
    },

    triggerText: {
      color: theme.components.dropdown.trigger.default.fg,
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

    triggerTextDisabled: {
      color: theme.components.dropdown.trigger.disabled.fg,
    },

    icon: {
      alignItems: 'center',
      justifyContent: 'center',
    },

    arrow: {
      width: 16,
      height: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
