import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    content: {
      minWidth: 320,
      maxWidth: 600,
      maxHeight: '90%',
      padding: theme.tokens.spacing[4],
      backgroundColor: theme.components.modal.content.bg,
      borderColor: theme.components.modal.content.border,
      borderRadius: theme.tokens.radius.lg,
      borderWidth: 1,
      gap: theme.tokens.spacing[4],
      shadowColor: theme.tokens.shadows.lg.color,
      shadowOffset: {
        width: theme.tokens.shadows.lg.x,
        height: theme.tokens.shadows.lg.y,
      },
      shadowOpacity: theme.tokens.shadows.lg.opacity,
      shadowRadius: theme.tokens.shadows.lg.blur,
      elevation: theme.tokens.shadows.lg.elevation,
    },
  });
