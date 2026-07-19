import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createContentStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    toolbar: {
      minHeight: 52,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.tokens.spacing[4],
      borderBottomColor: theme.components.select.dropdown.separator.bg,
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

    list: {
      maxHeight: 420,
    },

    listContent: {
      paddingHorizontal: theme.tokens.spacing[2],
      paddingVertical: theme.tokens.spacing[2],
    },

    empty: {
      minHeight: 72,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.tokens.spacing[4],
    },

    emptyText: {
      color: theme.components.select.dropdown.empty.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.md,
      lineHeight: theme.tokens.typography.lineHeight.md,
      textAlign: 'center',
    },

    loading: {
      minHeight: 72,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.tokens.spacing[2],
      padding: theme.tokens.spacing[4],
    },

    loadingText: {
      color: theme.components.select.dropdown.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.md,
      lineHeight: theme.tokens.typography.lineHeight.md,
    },
  });
