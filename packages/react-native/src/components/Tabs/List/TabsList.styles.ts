import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    list: {
      flexDirection: 'row',
      alignSelf: 'stretch',
      width: '100%',
      gap: theme.tokens.spacing[5],
      marginBottom: theme.tokens.spacing[4],
    },

    listPills: {
      backgroundColor: theme.components.tabs.pills.default.bg,
      padding: 0,
    },

    listVertical: {
      alignSelf: 'flex-start',
      flexDirection: 'column',
      gap: theme.tokens.spacing[1],
      marginRight: theme.tokens.spacing[4],
      marginBottom: 0,
    },
  });
