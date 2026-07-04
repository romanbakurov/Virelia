import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    separator: {
      height: 1,
      backgroundColor: theme.components.dropdown.separator.bg,
    },
  });
