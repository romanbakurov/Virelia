import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    panel: {
      width: '100%',
      minWidth: 0,
      alignSelf: 'stretch',
      padding: theme.tokens.spacing[4],
    },

    panelVertical: {
      flex: 1,
      flexBasis: 0,
      flexShrink: 1,
      minWidth: 0,
      alignSelf: 'stretch',
    },

    panelHidden: {
      display: 'none',
    },
  });
