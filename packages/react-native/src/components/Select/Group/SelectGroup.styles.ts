import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createGroupStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    groupLabel: {
      paddingHorizontal: theme.tokens.spacing[3],
      paddingTop: theme.tokens.spacing[4],
      paddingBottom: theme.tokens.spacing[1],
      color: theme.components.select.dropdown.groupLabel.fg,
      fontFamily: theme.tokens.typography.family.medium,
      fontSize: theme.tokens.typography.size.xs,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },

    separator: {
      height: 1,
      marginHorizontal: theme.tokens.spacing[3],
      marginVertical: theme.tokens.spacing[2],
      backgroundColor: theme.components.select.dropdown.separator.bg,
    },
  });
