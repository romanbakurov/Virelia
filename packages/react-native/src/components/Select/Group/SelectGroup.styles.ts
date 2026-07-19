import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createGroupStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    groupLabel: {
      paddingHorizontal: theme.tokens.spacing[3],
      paddingTop: theme.tokens.spacing[4],
      paddingBottom: theme.tokens.spacing[1],
      color: theme.components.select.dropdown.groupLabel.fg,
      fontFamily: theme.tokens.typography.family.medium,
      fontSize: theme.tokens.typography.size.xs,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },

    groupAction: {
      minHeight: 36,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.tokens.spacing[2],
      paddingHorizontal: theme.tokens.spacing[3],
      paddingTop: theme.tokens.spacing[4],
      paddingBottom: theme.tokens.spacing[1],
    },

    groupActionText: {
      color: theme.components.select.dropdown.groupLabel.fg,
      fontFamily: theme.tokens.typography.family.medium,
      fontSize: theme.tokens.typography.size.xs,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
    },

    groupActionMeta: {
      color: theme.components.select.option.default.fg,
      fontFamily: theme.tokens.typography.family.medium,
      fontSize: theme.tokens.typography.size.xs,
    },

    separator: {
      height: 1,
      marginHorizontal: theme.tokens.spacing[3],
      marginVertical: theme.tokens.spacing[2],
      backgroundColor: theme.components.select.dropdown.separator.bg,
    },
  });
