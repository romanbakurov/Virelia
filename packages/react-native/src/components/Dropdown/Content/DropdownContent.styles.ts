import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    modalRoot: {
      flex: 1,
    },

    sheet: {
      justifyContent: 'flex-end',
    },

    modal: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.tokens.spacing[4],
    },

    popover: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.tokens.spacing[4],
    },

    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: theme.semantic.overlay.backdrop,
    },

    menu: {
      maxHeight: '50%',
      overflow: 'hidden',
      padding: theme.tokens.spacing[1],
      backgroundColor: theme.components.dropdown.content.bg,
      borderColor: theme.components.dropdown.content.border,
      borderTopLeftRadius: theme.tokens.radius.lg,
      borderTopRightRadius: theme.tokens.radius.lg,
      borderWidth: 1,

      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: 0.24,
      shadowRadius: 16,
      elevation: 12,
    },

    sheetMenu: {
      width: '100%',
      maxHeight: '70%',
      borderTopLeftRadius: theme.tokens.radius.lg,
      borderTopRightRadius: theme.tokens.radius.lg,
    },

    modalMenu: {
      width: '100%',
      maxWidth: 420,
      maxHeight: '70%',
      borderRadius: theme.tokens.radius.lg,
    },

    popoverMenu: {
      width: '100%',
      maxWidth: 360,
      maxHeight: '60%',
      borderRadius: theme.tokens.radius.md,
    },
  });
