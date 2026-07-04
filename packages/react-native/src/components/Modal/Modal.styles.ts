import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    overlay: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
      padding: theme.tokens.spacing[5],
    },

    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: theme.components.modal.overlay.bg,
    },
  });
