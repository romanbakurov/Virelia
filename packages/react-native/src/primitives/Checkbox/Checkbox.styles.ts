import { StyleSheet } from 'react-native';

import type { NativeTheme } from '../../theme';

export const createStyles = (theme: NativeTheme) =>
  StyleSheet.create({
    container: {
      gap: theme.tokens.spacing[2],
    },

    wrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.tokens.spacing[3],
    },

    wrapperLabelStart: {
      flexDirection: 'row-reverse',
    },

    iconOnly: {
      justifyContent: 'center',
      minWidth: 44,
      minHeight: 44,
    },

    disabled: {
      opacity: 1,
    },

    box: {
      flexShrink: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.components.checkbox.default.bg,
      borderWidth: 2,
      borderColor: theme.components.checkbox.default.border,
      borderRadius: theme.tokens.radius.xs,
    },

    boxSm: {
      width: 16,
      height: 16,
      borderWidth: 1,
    },

    boxMd: {
      width: 20,
      height: 20,
      borderWidth: 2,
    },

    boxLg: {
      width: 24,
      height: 24,
      borderWidth: 2,
    },

    boxChecked: {
      backgroundColor: theme.components.checkbox.primary.default.bg,
      borderColor: theme.components.checkbox.primary.default.border,
    },

    boxCheckedHover: {
      backgroundColor: theme.components.checkbox.primary.hover.bg,
      borderColor: theme.components.checkbox.primary.hover.border,
    },

    boxCheckedPressed: {
      backgroundColor: theme.components.checkbox.primary.pressed.bg,
      borderColor: theme.components.checkbox.primary.pressed.border,
    },

    boxDisabled: {
      backgroundColor: theme.components.checkbox.disabled.bg,
      borderColor: theme.components.checkbox.disabled.border,
    },

    boxError: {
      borderColor: theme.components.checkbox.error.border,
    },

    checkmark: {
      color: theme.components.checkbox.primary.default.fg,
    },

    checkmarkHover: {
      color: theme.components.checkbox.primary.hover.fg,
    },

    checkmarkPressed: {
      color: theme.components.checkbox.primary.pressed.fg,
    },

    indeterminateMark: {
      width: '60%',
      height: 2,
      backgroundColor: theme.components.checkbox.primary.default.fg,
      borderRadius: theme.tokens.radius.full,
    },

    indeterminateMarkHover: {
      backgroundColor: theme.components.checkbox.primary.hover.fg,
    },

    indeterminateMarkPressed: {
      backgroundColor: theme.components.checkbox.primary.pressed.fg,
    },

    label: {
      flexShrink: 1,
      fontFamily: theme.tokens.typography.family.regular,
      color: theme.components.checkbox.default.fg,
    },

    labelChecked: {
      color: theme.components.checkbox.primary.default.labelFg,
    },

    labelCheckedHover: {
      color: theme.components.checkbox.primary.hover.labelFg,
    },

    labelCheckedPressed: {
      color: theme.components.checkbox.primary.pressed.labelFg,
    },

    labelSm: {
      fontSize: theme.tokens.typography.size.sm,
      lineHeight: theme.tokens.typography.lineHeight.md,
    },

    labelMd: {
      fontSize: theme.tokens.typography.size.md,
      lineHeight: theme.tokens.typography.lineHeight.md,
    },

    labelLg: {
      fontSize: theme.tokens.typography.size.lg,
      lineHeight: theme.tokens.typography.lineHeight.md,
    },

    labelDisabled: {
      color: theme.components.checkbox.disabled.fg,
    },

    requiredMark: {
      color: theme.components.checkbox.error.fg,
    },

    descriptionText: {
      color: theme.components.formField.description.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.sm,
      lineHeight: theme.tokens.typography.lineHeight.sm,
    },

    descriptionTextDisabled: {
      color: theme.components.formField.disabled.descriptionFg,
    },

    errorText: {
      color: theme.components.checkbox.error.fg,
      fontFamily: theme.tokens.typography.family.regular,
      fontSize: theme.tokens.typography.size.sm,
      lineHeight: theme.tokens.typography.lineHeight.sm,
    },

    errorTextSm: {
      marginLeft: 16 + theme.tokens.spacing[3],
    },

    errorTextMd: {
      marginLeft: 20 + theme.tokens.spacing[3],
    },

    errorTextLg: {
      marginLeft: 24 + theme.tokens.spacing[3],
    },
  });
