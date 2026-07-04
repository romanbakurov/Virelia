import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    trigger: {
      minWidth: 32,
      minHeight: 32,
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      gap: theme.tokens.spacing[2],
      padding: theme.tokens.spacing[2],
      backgroundColor: theme.components.dropdown.trigger.default.bg,
      borderColor: theme.components.dropdown.trigger.default.border,
      borderRadius: theme.tokens.radius.lg,
      borderWidth: 2,
    },

    iconOnly: {
      width: 42,
      height: 42,
      padding: theme.tokens.spacing[2],
      borderRadius: theme.tokens.radius.full,
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
      fontSize: theme.tokens.typography.size.md,
      lineHeight: theme.tokens.typography.lineHeight.md,
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
