import { StyleSheet, type TextStyle } from 'react-native';

import type { NativeTheme } from '../../theme';

const fontWeight = (value: string): TextStyle['fontWeight'] =>
  value as TextStyle['fontWeight'];

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    root: {
      width: '100%',
      minWidth: 0,
      alignSelf: 'stretch',
      gap: theme.tokens.spacing[2],
    },

    label: {
      color: theme.components.formField.label.fg,
      fontFamily: theme.tokens.typography.family.medium,
      fontSize: theme.tokens.typography.size.md,
      fontWeight: fontWeight(theme.tokens.typography.weight.medium),
      lineHeight: theme.tokens.typography.lineHeight.md,
    },

    labelDisabled: {
      color: theme.components.formField.disabled.labelFg,
    },

    required: {
      marginLeft: theme.tokens.spacing[1],
      color: theme.components.formField.requiredMark.fg,
    },

    description: {
      color: theme.components.formField.description.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.sm,
      lineHeight: theme.tokens.typography.lineHeight.sm,
    },

    descriptionDisabled: {
      color: theme.components.formField.disabled.descriptionFg,
    },

    control: {
      width: '100%',
      minWidth: 0,
      alignSelf: 'stretch',
    },

    error: {
      color: theme.components.formField.helperText.error.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.sm,
      lineHeight: theme.tokens.typography.lineHeight.sm,
    },
  });
