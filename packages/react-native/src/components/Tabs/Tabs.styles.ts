import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    root: {
      width: '100%',
    },

    rootVertical: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.tokens.spacing[6],
    },

    listVertical: {
      flexDirection: 'column',
      width: 140,
      flexShrink: 0,
    },

    tabVertical: {
      flex: 0,
      width: '100%',
      justifyContent: 'flex-start',
    },

    panel: {
      flex: 1,
      flexShrink: 1,
      minWidth: 0,
    },
  });
