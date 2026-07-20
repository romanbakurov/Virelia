import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    body: {
      paddingBottom: theme.components.modal.body.paddingBottom,
    },

    text: {
      color: theme.components.modal.content.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.md,
      lineHeight: theme.tokens.typography.lineHeight.md,
    },

    description: {
      color: theme.components.modal.description.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.sm,
      lineHeight: theme.tokens.typography.lineHeight.sm,
    },
  });
