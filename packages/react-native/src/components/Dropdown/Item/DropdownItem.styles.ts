import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    item: {
      minWidth: 0,
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.tokens.spacing[4],
      paddingHorizontal: theme.tokens.spacing[3],
      paddingVertical: theme.tokens.spacing[2],
      backgroundColor: theme.components.dropdown.item.default.bg,
      borderRadius: theme.tokens.radius.sm,
    },

    itemPressed: {
      backgroundColor: theme.components.dropdown.item.hover.bg,
    },

    itemDisabled: {
      backgroundColor: theme.components.dropdown.item.disabled.bg,
    },

    itemDangerPressed: {
      backgroundColor: theme.components.dropdown.item.danger.hover.bg,
    },

    itemText: {
      flex: 1,
      minWidth: 0,
      color: theme.components.dropdown.item.default.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.md,
      lineHeight: 24,
    },

    itemTextDisabled: {
      color: theme.components.dropdown.item.disabled.fg,
    },

    dangerText: {
      color: theme.components.dropdown.item.danger.default.fg,
    },
  });
