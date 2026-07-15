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
      borderRadius: theme.tokens.radius.lg,
    },

    listVertical: {
      flexDirection: 'column',
      alignSelf: 'flex-start',
      width: 140,
      minWidth: 140,
      maxWidth: 140,
      flexGrow: 0,
      flexShrink: 0,
      gap: theme.tokens.spacing[1],
      marginBottom: 0,
    },
  });
