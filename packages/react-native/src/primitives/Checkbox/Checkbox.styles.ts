import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.tokens.spacing[3],
    },

    disabled: {
      opacity: 1,
    },

    box: {
      width: 22,
      height: 22,
      borderWidth: 2,
      borderColor: theme.components.checkbox.default.border,
      borderRadius: theme.tokens.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.components.checkbox.default.bg,
    },

    boxChecked: {
      backgroundColor: theme.components.checkbox.checked.default.bg,
      borderColor: theme.components.checkbox.checked.default.border,
    },

    boxDisabled: {
      backgroundColor: theme.components.checkbox.disabled.bg,
      borderColor: theme.components.checkbox.disabled.border,
    },

    boxError: {
      borderColor: theme.components.checkbox.error.border,
    },

    label: {
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.md,
      color: theme.components.checkbox.default.fg,
    },

    labelDisabled: {
      color: theme.components.checkbox.disabled.fg,
    },

    container: {
      gap: theme.tokens.spacing[2],
    },

    errorText: {
      color: theme.components.checkbox.error.fg,
      fontSize: theme.tokens.typography.size.sm,
      lineHeight: theme.tokens.typography.lineHeight.sm,
      marginLeft: 22 + theme.tokens.spacing[3],
    },
  });
