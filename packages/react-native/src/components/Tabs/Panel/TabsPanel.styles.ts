import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    panel: {
      flex: 1,
      minWidth: 0,
      padding: theme.tokens.spacing[4],
    },
  });
