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
    },

    title: {
      flex: 1,
      color: theme.components.modal.title.fg,
      fontFamily: theme.tokens.typography.family.semibold,
      fontSize: theme.tokens.typography.size.lg,
      lineHeight: theme.tokens.typography.lineHeight.md,
    },

    closeButton: {
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.components.modal.closeButton.default.bg,
      borderRadius: theme.tokens.radius.full,
    },

    closeButtonPressed: {
      backgroundColor: theme.components.modal.closeButton.hover.bg,
    },

    closeButtonDisabled: {
      backgroundColor: theme.components.modal.closeButton.disabled.bg,
    },
  });
