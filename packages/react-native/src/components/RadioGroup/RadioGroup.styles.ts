import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    group: {
      width: '100%',
      minWidth: 0,
      alignSelf: 'stretch',
      gap: theme.tokens.spacing[2],
    },

    horizontal: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.tokens.spacing[4],
    },

    option: {
      minWidth: 0,
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.tokens.spacing[2],
    },

    optionDisabled: {
      opacity: 1,
    },

    radio: {
      width: 16,
      height: 16,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: theme.components.radio.default.border,
      borderRadius: 999,
      borderWidth: 1,
      backgroundColor: theme.components.radio.default.bg,
    },

    radioSelected: {
      borderColor: theme.components.radio.checked.default.border,
    },

    radioDisabled: {
      borderColor: theme.components.radio.disabled.border,
      backgroundColor: theme.components.radio.disabled.bg,
    },

    dot: {
      width: 12,
      height: 12,
      backgroundColor: theme.components.radio.checked.default.bg,
      borderRadius: 999,
    },

    dotDisabled: {
      backgroundColor: theme.components.radio.disabled.fg,
    },

    label: {
      minWidth: 0,
      color: theme.components.radio.default.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.md,
      lineHeight: theme.tokens.typography.lineHeight.md,
    },

    labelDisabled: {
      color: theme.components.radio.disabled.fg,
    },

    labelSelected: {
      color: theme.components.radio.checked.default.fg,
    },
  });
