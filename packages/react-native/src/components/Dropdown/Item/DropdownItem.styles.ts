import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    item: {
      minWidth: 0,
      minHeight: 44,
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.tokens.spacing[4],
      paddingHorizontal: theme.tokens.spacing[3],
      paddingVertical: theme.tokens.spacing[2],
      backgroundColor: theme.components.dropdown.item.default.bg,
      borderRadius: theme.tokens.radius.sm,
    },

    itemText: {
      flex: 1,
      minWidth: 0,
      color: theme.components.dropdown.item.default.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.md,
      lineHeight: theme.tokens.typography.lineHeight.md,
    },
  });
