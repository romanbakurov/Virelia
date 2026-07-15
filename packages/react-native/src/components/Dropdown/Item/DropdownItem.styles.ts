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
      backgroundColor: theme.components.dropdown.item.pressed.bg,
    },

    itemDisabled: {
      backgroundColor: theme.components.dropdown.item.disabled.bg,
    },

    itemDanger: {
      backgroundColor: theme.components.dropdown.item.danger.default.bg,
    },

    itemDangerPressed: {
      backgroundColor: theme.components.dropdown.item.danger.active.bg,
    },

    itemText: {
      flex: 1,
      minWidth: 0,
      color: theme.components.dropdown.item.default.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.md,
      lineHeight: theme.tokens.typography.lineHeight.md,
    },

    itemTextPressed: {
      color: theme.components.dropdown.item.pressed.fg,
    },

    itemTextDisabled: {
      color: theme.components.dropdown.item.disabled.fg,
    },

    itemTextDanger: {
      color: theme.components.dropdown.item.danger.default.fg,
    },

    itemTextDangerPressed: {
      color: theme.components.dropdown.item.danger.active.fg,
    },
  });
