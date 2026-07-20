import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    footer: {
      flexDirection: 'row',
      gap: theme.components.modal.footer.gap,
      justifyContent: 'flex-end',
      paddingTop: theme.components.modal.footer.paddingTop,
    },
  });
