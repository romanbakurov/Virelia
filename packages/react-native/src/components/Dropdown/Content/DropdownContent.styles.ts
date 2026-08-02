import { Platform, StyleSheet } from 'react-native';

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

      ...Platform.select({
        web: {
          boxShadow: `${theme.tokens.shadows.lg.x}px ${-theme.tokens.shadows.lg.y}px ${theme.tokens.shadows.lg.blur}px ${theme.tokens.shadows.lg.color}`,
        },
        default: {
          shadowColor: theme.tokens.shadows.lg.color,
          shadowOffset: {
            width: theme.tokens.shadows.lg.x,
            height: -theme.tokens.shadows.lg.y,
          },
          shadowOpacity: theme.tokens.shadows.lg.opacity,
          shadowRadius: theme.tokens.shadows.lg.blur,
          elevation: theme.tokens.shadows.lg.elevation,
        },
      }),
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

    searchWrap: {
      minHeight: 40,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.tokens.spacing[2],
      paddingHorizontal: theme.tokens.spacing[3],
      borderBottomWidth: 1,
      borderBottomColor: theme.components.dropdown.separator.bg,
    },

    searchIcon: {
      width: 16,
      height: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },

    searchInput: {
      flex: 1,
      minWidth: 0,
      paddingVertical: theme.tokens.spacing[2],
      color: theme.components.dropdown.content.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.sm,
      lineHeight: theme.tokens.typography.lineHeight.sm,
    },
  });
