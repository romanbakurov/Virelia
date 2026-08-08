import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createSearchStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    searchWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: theme.tokens.spacing[4],
      marginTop: theme.tokens.spacing[3],
      marginBottom: theme.tokens.spacing[2],
      paddingHorizontal: theme.tokens.spacing[3],
      minHeight: 44,
      borderWidth: 1,
      borderRadius: theme.tokens.radius.md,
      borderColor: theme.components.select.dropdown.search.border,
      backgroundColor: theme.components.select.dropdown.search.bg,
    },

    searchInput: {
      flex: 1,
      minWidth: 0,
      color: theme.components.select.dropdown.search.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.md,
      lineHeight: theme.tokens.typography.lineHeight.md,
      paddingVertical: 0,
    },

    searchIcon: {
      width: 18,
      height: 18,
      marginRight: theme.tokens.spacing[2],
      alignItems: 'center',
      justifyContent: 'center',
    },

    searchClearButton: {
      width: 28,
      height: 28,
      marginLeft: theme.tokens.spacing[2],
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 999,
      backgroundColor: theme.components.select.clearButton.hoverBg,
    },
  });
