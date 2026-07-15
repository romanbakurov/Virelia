import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    root: {
      width: '100%',
      minWidth: 0,
    },

    rootVertical: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      width: '100%',
      minWidth: 0,
      gap: theme.tokens.spacing[6],
    },
  });
