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

    listSegmented: {
      padding: theme.tokens.spacing[1],
      backgroundColor: theme.components.tabs.list.segmentedBg,
      borderColor: theme.components.tabs.list.border,
      borderRadius: theme.tokens.radius.lg,
      borderWidth: 1,
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
