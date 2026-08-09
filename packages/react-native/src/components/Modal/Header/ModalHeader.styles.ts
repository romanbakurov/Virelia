import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: theme.components.modal.header.gap,
      justifyContent: 'space-between',
      paddingBottom: theme.components.modal.header.paddingBottom,
    },

    headerContent: {
      flex: 1,
      gap: theme.tokens.spacing['1'],
    },

    title: {
      flex: 1,
      color: theme.components.modal.title.fg,
      fontFamily: theme.tokens.typography.family.semibold,
      fontSize: theme.tokens.typography.size.lg,
      lineHeight: theme.tokens.typography.lineHeight.md,
    },

    description: {
      color: theme.components.modal.description.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.sm,
      lineHeight: theme.tokens.typography.lineHeight.sm,
    },

    closeButton: {
      width: theme.components.modal.closeButton.size,
      height: theme.components.modal.closeButton.size,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.components.modal.closeButton.default.bg,
      borderRadius: theme.components.modal.closeButton.radius,
    },

    closeButtonPressed: {
      backgroundColor: theme.components.modal.closeButton.hover.bg,
    },

    closeButtonDisabled: {
      backgroundColor: theme.components.modal.closeButton.disabled.bg,
    },
  });
