import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    footer: {
      flexDirection: 'row',
      gap: theme.tokens.spacing[3],
      justifyContent: 'flex-end',
      paddingTop: theme.tokens.spacing[4],
    },
  });
