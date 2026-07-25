import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    list: {
      position: 'relative',
      flexDirection: 'row',
      alignSelf: 'stretch',
      width: '100%',
      gap: theme.tokens.spacing[5],
      marginBottom: theme.tokens.spacing[6],
    },

    listSegmented: {
      padding: 2,
      backgroundColor: theme.components.tabs.list.segmentedBg,
      borderColor: theme.components.tabs.list.border,
      borderRadius: theme.tokens.radius.xl,
      borderWidth: 1,
    },

    listVertical: {
      flexDirection: 'column',
      alignSelf: 'flex-start',
      width: 156,
      minWidth: 156,
      maxWidth: 156,
      flexGrow: 0,
      flexShrink: 0,
      gap: theme.tokens.spacing[1],
      marginBottom: 0,
    },
  });
