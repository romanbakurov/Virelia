import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    root: {
      alignSelf: 'flex-start',
    },

    pressable: {
      minWidth: 32,
      minHeight: 32,
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.tokens.spacing[2],
    },

    pressablePressed: {
      opacity: 0.8,
    },

    pressableDisabled: {
      opacity: 1,
    },

    control: {
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderRadius: theme.tokens.radius.full,
      borderColor: theme.components.radio.default.border,
      backgroundColor: theme.components.radio.default.bg,
    },

    controlChecked: {
      borderColor: theme.components.radio.primary.default.border,
      backgroundColor: theme.components.radio.primary.default.bg,
    },

    controlCheckedPressed: {
      borderColor: theme.components.radio.primary.pressed.border,
      backgroundColor: theme.components.radio.primary.pressed.bg,
    },

    controlInvalid: {
      borderColor: theme.components.radio.invalid.border,
    },

    controlDisabled: {
      borderColor: theme.components.radio.disabled.border,
      backgroundColor: theme.components.radio.disabled.bg,
    },

    controlCheckedDisabled: {
      borderColor: theme.components.radio.selectedDisabled.border,
      backgroundColor: theme.components.radio.selectedDisabled.bg,
    },

    indicator: {
      borderRadius: theme.tokens.radius.full,
      backgroundColor: theme.components.radio.primary.default.fg,
    },

    indicatorPressed: {
      backgroundColor: theme.components.radio.primary.pressed.fg,
    },

    indicatorDisabled: {
      backgroundColor: theme.components.radio.selectedDisabled.fg,
    },

    content: {
      flexShrink: 1,
      gap: theme.tokens.spacing[1],
    },

    label: {
      color: theme.components.radio.default.fg,
      fontFamily: theme.tokens.typography.family.regular,
    },

    labelChecked: {
      color: theme.components.radio.primary.default.labelFg,
    },

    labelCheckedPressed: {
      color: theme.components.radio.primary.pressed.labelFg,
    },

    labelInvalid: {
      color: theme.components.radio.invalid.fg,
    },

    description: {
      color: theme.components.formField.description.fg,
      fontFamily: theme.tokens.typography.family.regular,
    },

    textDisabled: {
      color: theme.components.radio.disabled.fg,
    },

    error: {
      color: theme.components.formField.helperText.error.fg,
      fontFamily: theme.tokens.typography.family.regular,
    },
  });
