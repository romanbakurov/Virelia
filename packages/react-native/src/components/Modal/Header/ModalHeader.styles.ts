import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.tokens.spacing[3],
      justifyContent: 'space-between',
      paddingBottom: theme.tokens.spacing[4],
      backgroundColor: theme.components.modal.content.bg,
    },

    title: {
      color: theme.components.modal.title.fg,
      flex: 1,
      fontFamily: theme.tokens.typography.family.semibold,
      fontSize: theme.tokens.typography.size.lg,
      lineHeight: theme.tokens.typography.lineHeight.md,
    },

    closeButton: {
      alignItems: 'center',
      backgroundColor: theme.components.modal.closeButton.default.bg,
      borderRadius: theme.tokens.radius.full,
      height: 32,
      justifyContent: 'center',
      width: 32,
    },
  });
