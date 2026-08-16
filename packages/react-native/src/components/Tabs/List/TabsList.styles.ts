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

    listLine: {
      borderBottomWidth: 1,
      borderColor: theme.components.tabs.list.border,
    },

    listLineVertical: {
      borderRightWidth: 1,
      borderBottomWidth: 0,
    },

    listSegmented: {
      alignSelf: 'flex-start',
      width: 'auto',
      gap: 0,
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

    listPillsVertical: {
      gap: theme.tokens.spacing[2],
    },

    listSegmentedVertical: {
      gap: 0,
      padding: 2,
      width: 156,
      minWidth: 156,
      maxWidth: 156,
      backgroundColor: theme.components.tabs.list.segmentedBg,
      borderColor: theme.components.tabs.list.border,
      borderRadius: theme.tokens.radius.xl,
      borderWidth: 1,
    },
  });
