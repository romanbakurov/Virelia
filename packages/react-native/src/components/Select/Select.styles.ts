import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    modalRoot: {
      flex: 1,
      justifyContent: 'flex-end',
    },

    backdrop: {
      ...StyleSheet.absoluteFill,
      backgroundColor: theme.semantic.overlay.backdrop,
    },

    sheet: {
      maxHeight: '50%',
      overflow: 'hidden',

      backgroundColor: theme.components.select.dropdown.bg,
      borderColor: theme.components.select.dropdown.border,
      borderTopLeftRadius: theme.tokens.radius.lg,
      borderTopRightRadius: theme.tokens.radius.lg,
      borderWidth: 1,
      borderBottomWidth: 0,

      shadowColor: theme.tokens.shadows.lg.color,
      shadowOffset: {
        width: theme.tokens.shadows.lg.x,
        height: -theme.tokens.shadows.lg.y,
      },
      shadowOpacity: theme.tokens.shadows.lg.opacity,
      shadowRadius: theme.tokens.shadows.lg.blur,
      elevation: theme.tokens.shadows.lg.elevation,
    },

    toolbar: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.tokens.spacing[4],
      borderBottomColor: theme.components.select.dropdown.border,
      borderBottomWidth: 1,
    },

    title: {
      flex: 1,
      marginHorizontal: theme.tokens.spacing[3],
      color: theme.components.select.dropdown.fg,
      fontFamily: theme.tokens.typography.family.medium,
      fontSize: theme.tokens.typography.size.md,
      lineHeight: theme.tokens.typography.lineHeight.md,
      textAlign: 'center',
    },

    toolbarAction: {
      minWidth: 64,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },

    cancelText: {
      color: theme.components.select.trigger.placeholder.fg,
      fontFamily: theme.tokens.typography.family.medium,
      fontSize: theme.tokens.typography.size.md,
      lineHeight: theme.tokens.typography.lineHeight.md,
    },

    doneText: {
      color: theme.semantic.text.interactive,
      fontFamily: theme.tokens.typography.family.medium,
      fontSize: theme.tokens.typography.size.md,
      lineHeight: theme.tokens.typography.lineHeight.md,
    },

    picker: {
      width: '100%',
    },
  });
