import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../theme';

export const createStyles = (_theme: NativeTheme) =>
  StyleSheet.create({
    items: {
      width: '100%',
      minWidth: 0,
      alignSelf: 'stretch',
    },

    horizontal: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
    },
  });
