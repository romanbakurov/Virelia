import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createItemStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    option: {
      minHeight: 44,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.tokens.spacing[3],
      paddingHorizontal: theme.tokens.spacing[3],
      paddingVertical: theme.tokens.spacing[2],
      marginBottom: 2,
      borderRadius: theme.tokens.radius.md,
      borderWidth: 1,
      borderColor: 'transparent',
    },

    optionDisabled: {
      opacity: 0.55,
    },

    optionIcon: {
      width: 22,
      minWidth: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },

    optionTextWrap: {
      flex: 1,
      minWidth: 0,
      gap: 2,
    },

    optionLabel: {
      fontFamily: theme.tokens.typography.family.medium,
      fontSize: theme.tokens.typography.size.md,
      lineHeight: theme.tokens.typography.lineHeight.md,
    },

    optionDescription: {
      color: theme.components.select.option.description.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.sm,
      lineHeight: theme.tokens.typography.lineHeight.sm,
    },

    badge: {
      paddingHorizontal: theme.tokens.spacing[2],
      paddingVertical: 2,
      borderRadius: 999,
      borderWidth: 1,
    },

    badgeText: {
      fontFamily: theme.tokens.typography.family.medium,
      fontSize: theme.tokens.typography.size.xs,
      lineHeight: theme.tokens.typography.lineHeight.xs,
    },

    check: {
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
