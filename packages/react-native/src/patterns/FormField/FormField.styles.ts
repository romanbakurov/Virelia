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
      gap: theme.components.formField.size.md.gap,
    },

    label: {
      color: theme.components.formField.label.fg,
      fontFamily: theme.tokens.typography.family.medium,
      fontSize: theme.components.formField.size.md.labelFontSize,
      fontWeight: fontWeight(theme.tokens.typography.weight.medium),
      lineHeight: theme.components.formField.size.md.labelLineHeight,
    },

    labelDisabled: {
      color: theme.components.formField.disabled.labelFg,
    },

    required: {
      marginLeft: theme.tokens.spacing[1],
      color: theme.components.formField.requiredMark.fg,
    },

    optional: {
      marginLeft: theme.components.formField.size.md.gap,
      color: theme.components.formField.optional.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.components.formField.size.md.optionalFontSize,
      lineHeight: theme.components.formField.size.md.optionalLineHeight,
    },

    labelInfo: {
      marginLeft: theme.components.formField.size.md.gap,
      color: theme.components.formField.labelInfo.fg,
      fontFamily: theme.tokens.typography.family.medium,
      fontSize: theme.components.formField.size.md.labelInfoFontSize,
      lineHeight: theme.components.formField.size.md.labelInfoSize,
    },

    description: {
      color: theme.components.formField.description.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.components.formField.size.md.descriptionFontSize,
      lineHeight: theme.components.formField.size.md.descriptionLineHeight,
    },

    descriptionDisabled: {
      color: theme.components.formField.disabled.descriptionFg,
    },

    customLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.tokens.spacing[1],
    },

    control: {
      width: '100%',
      minWidth: 0,
      alignSelf: 'stretch',
    },

    error: {
      color: theme.components.formField.helperText.error.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.components.formField.size.md.helperTextFontSize,
      lineHeight: theme.components.formField.size.md.helperTextLineHeight,
    },

    helperTextDisabled: {
      color: theme.components.formField.disabled.helperTextFg,
    },
  });
