import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    items: {
      width: '100%',
      minWidth: 0,
      alignSelf: 'stretch',
      gap: theme.tokens.spacing[1],
    },

    horizontal: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      columnGap: theme.tokens.spacing[6],
      rowGap: theme.tokens.spacing[4],
    },
  });
