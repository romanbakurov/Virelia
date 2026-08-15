import { Platform, StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createPresentationStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    modalRoot: {
      flex: 1,
    },

    sheetRoot: {
      justifyContent: 'flex-end',
    },

    modalPresentationRoot: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.tokens.spacing[4],
    },

    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: theme.semantic.overlay.backdrop,
    },

    content: {
      overflow: 'hidden',
      backgroundColor: theme.components.select.dropdown.bg,
      borderColor: theme.components.select.dropdown.border,
      borderWidth: 1,
    },

    surface: {
      ...Platform.select({
        web: {
          boxShadow: theme.components.select.dropdown.shadow,
        },
        default: {
          shadowColor: theme.tokens.shadows.lg.color,
          shadowOffset: {
            width: theme.tokens.shadows.lg.x,
            height: theme.tokens.shadows.lg.y,
          },
          shadowOpacity: theme.tokens.shadows.lg.opacity,
          shadowRadius: theme.tokens.shadows.lg.blur,
          elevation: theme.tokens.shadows.lg.elevation,
        },
      }),
    },

    sheetSurface: {
      borderTopLeftRadius: theme.tokens.radius.lg,
      borderTopRightRadius: theme.tokens.radius.lg,

      ...Platform.select({
        web: {
          boxShadow: `0 -${theme.tokens.shadows.lg.y}px ${
            theme.tokens.shadows.lg.blur
          }px color-mix(in srgb, ${
            theme.tokens.shadows.lg.color
          } ${theme.tokens.shadows.lg.opacity * 100}%, transparent)`,
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

    modalSurface: {
      width: '100%',
      maxWidth: 420,
      borderRadius: theme.tokens.radius.lg,
    },

    popoverSurface: {
      borderRadius: theme.tokens.radius.lg,
    },

    sheet: {
      maxHeight: '74%',
      borderTopLeftRadius: theme.tokens.radius.lg,
      borderTopRightRadius: theme.tokens.radius.lg,
      borderBottomWidth: 0,
    },

    modalPresentation: {
      width: '100%',
      maxWidth: 420,
      maxHeight: '74%',
      borderRadius: theme.tokens.radius.lg,
    },

    popover: {
      maxHeight: '60%',
      borderRadius: theme.tokens.radius.lg,
    },

    handleWrap: {
      alignItems: 'center',
      paddingTop: theme.tokens.spacing[3],
    },

    handle: {
      width: 44,
      height: 4,
      borderRadius: 999,
      backgroundColor: theme.semantic.border.muted,
    },
  });
