import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    groupLabel: {
      paddingHorizontal: theme.tokens.spacing[4],
      paddingVertical: theme.tokens.spacing[2],
      color: theme.components.dropdown.groupLabel.fg,
      fontFamily: theme.tokens.typography.family.medium,
      fontSize: theme.tokens.typography.size.xs,
      lineHeight: theme.tokens.typography.lineHeight.sm,
      textTransform: 'uppercase',
    },
  });
