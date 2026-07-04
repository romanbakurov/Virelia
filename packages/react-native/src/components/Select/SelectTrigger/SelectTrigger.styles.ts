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

    triggerOpen: {
      borderColor: theme.components.select.trigger.focus.border,
    },

    triggerError: {
      borderColor: theme.components.select.trigger.error.border,
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
      fontSize: theme.tokens.typography.size.md,
      lineHeight: theme.tokens.typography.lineHeight.md,
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
