import { forwardRef, useEffect } from 'react';

import { useControllableState } from '@vellira-ui/core';
import { Check } from '@vellira-ui/icons';
import { Pressable, Text, View } from 'react-native';

import { useTheme, useThemeStyles } from '../../theme';
import { devWarning } from '../../utils/devWarning';

import { createStyles } from './Checkbox.styles';
import type { CheckboxProps } from './types';

const iconSizeBySize = {
  sm: 10,
  md: 12,
  lg: 14,
} as const;

const getCheckboxColor = (
  theme: ReturnType<typeof useTheme>['theme'],
  color: NonNullable<CheckboxProps['color']>
) => {
  if (color === 'neutral') {
    return {
      bg: theme.colors.gray[900],
      border: theme.colors.gray[900],
      fg: theme.colors.gray[50],
      hoverBg: theme.colors.gray[800],
      hoverBorder: theme.colors.gray[800],
      hoverFg: theme.colors.gray[50],
      pressedBg: theme.colors.gray[700],
      pressedBorder: theme.colors.gray[700],
      pressedFg: theme.colors.gray[50],
    };
  }

  if (color === 'success') {
    return {
      bg: theme.semantic.status.success.strong,
      border: theme.semantic.status.success.border,
      fg: theme.colors.success[50],
      hoverBg: theme.colors.success[700],
      hoverBorder: theme.colors.success[700],
      hoverFg: theme.colors.success[50],
      pressedBg: theme.colors.success[800],
      pressedBorder: theme.colors.success[800],
      pressedFg: theme.colors.success[50],
    };
  }

  if (color === 'warning') {
    return {
      bg: theme.semantic.status.warning.strong,
      border: theme.semantic.status.warning.border,
      fg: theme.colors.warning[950],
      hoverBg: theme.colors.warning[600],
      hoverBorder: theme.colors.warning[600],
      hoverFg: theme.colors.warning[950],
      pressedBg: theme.colors.warning[700],
      pressedBorder: theme.colors.warning[700],
      pressedFg: theme.colors.warning[950],
    };
  }

  if (color === 'danger') {
    return {
      bg: theme.semantic.status.error.strong,
      border: theme.semantic.status.error.border,
      fg: theme.colors.error[50],
      hoverBg: theme.colors.error[700],
      hoverBorder: theme.colors.error[700],
      hoverFg: theme.colors.error[50],
      pressedBg: theme.colors.error[800],
      pressedBorder: theme.colors.error[800],
      pressedFg: theme.colors.error[50],
    };
  }

  return {
    bg: theme.components.checkbox.checked.default.bg,
    border: theme.components.checkbox.checked.default.border,
    fg: theme.components.checkbox.checked.default.fg,
    hoverBg: theme.components.checkbox.checked.hover.bg,
    hoverBorder: theme.components.checkbox.checked.hover.border,
    hoverFg: theme.components.checkbox.checked.hover.fg,
    pressedBg: theme.components.checkbox.checked.pressed.bg,
    pressedBorder: theme.components.checkbox.checked.pressed.border,
    pressedFg: theme.components.checkbox.checked.pressed.fg,
  };
};

export const Checkbox = forwardRef<View, CheckboxProps>(
  (
    {
      label,
      description,
      icon,
      indeterminateIcon,
      checked,
      defaultChecked = false,
      disabled = false,
      required = false,
      indeterminate = false,
      size = 'md',
      color = 'primary',
      labelPosition = 'end',
      onCheckedChange,
      error,
      style,
      accessibilityLabel,
      accessibilityHint,
      ...PressableProps
    },
    ref
  ) => {
    const { theme } = useTheme();
    const styles = useThemeStyles(createStyles);
    const checkboxColor = getCheckboxColor(theme, color);

    const boxSizeStyle = {
      sm: styles.boxSm,
      md: styles.boxMd,
      lg: styles.boxLg,
    };

    const labelSizeStyle = {
      sm: styles.labelSm,
      md: styles.labelMd,
      lg: styles.labelLg,
    };

    const helperTextSizeStyle = {
      sm: styles.errorTextSm,
      md: styles.errorTextMd,
      lg: styles.errorTextLg,
    } as const;

    const hasError = Boolean(error);

    const [isChecked, setIsChecked] = useControllableState({
      value: checked,
      defaultValue: defaultChecked,
      onChange: onCheckedChange,
    });

    const handlePress = () => {
      if (disabled) return;

      setIsChecked(indeterminate ? true : !isChecked);
    };

    const resolvedAccessibilityLabel = accessibilityLabel ?? label;

    const resolvedAccessibilityHint = [accessibilityHint, description, error]
      .filter(Boolean)
      .join(' ');

    const accessibilityChecked = indeterminate ? 'mixed' : isChecked;

    useEffect(() => {
      devWarning(
        Boolean(resolvedAccessibilityLabel),
        'Checkbox: an accessible label must be provided through label or accessibilityLabel.'
      );
    }, [resolvedAccessibilityLabel]);

    return (
      <View style={styles.container}>
        <Pressable
          {...PressableProps}
          ref={ref}
          onPress={handlePress}
          disabled={disabled}
          accessibilityRole='checkbox'
          accessibilityState={{
            checked: accessibilityChecked,
            disabled,
          }}
          accessibilityHint={resolvedAccessibilityHint || undefined}
          accessibilityLabel={resolvedAccessibilityLabel}
          style={[
            styles.wrapper,
            labelPosition === 'start' && styles.wrapperLabelStart,
            !label && styles.iconOnly,
            disabled && styles.disabled,
            style,
          ]}
        >
          {({ pressed }) => {
            const isSelected = isChecked || indeterminate;

            const checkColor = disabled
              ? theme.components.checkbox.disabled.fg
              : pressed && isSelected
                ? checkboxColor.pressedFg
                : checkboxColor.fg;

            return (
              <>
                <View
                  style={[
                    styles.box,
                    boxSizeStyle[size],
                    isSelected && {
                      backgroundColor: checkboxColor.bg,
                      borderColor: checkboxColor.border,
                    },
                    isSelected &&
                      pressed && {
                        backgroundColor: checkboxColor.pressedBg,
                        borderColor: checkboxColor.pressedBorder,
                        transform: [{ scale: 0.96 }],
                      },
                    hasError && styles.boxError,
                    disabled && styles.boxDisabled,
                  ]}
                >
                  {indeterminate
                    ? (indeterminateIcon ?? (
                        <View
                          style={[
                            styles.indeterminateMark,
                            {
                              backgroundColor: pressed
                                ? checkboxColor.pressedFg
                                : checkboxColor.fg,
                            },
                          ]}
                        />
                      ))
                    : isChecked &&
                      (icon ?? (
                        <Check size={iconSizeBySize[size]} color={checkColor} />
                      ))}
                </View>

                {label && (
                  <Text
                    style={[
                      styles.label,
                      labelSizeStyle[size],
                      isSelected && styles.labelChecked,
                      isSelected &&
                        pressed && {
                          color:
                            theme.components.checkbox.checked.pressed.labelFg,
                        },
                      disabled && styles.labelDisabled,
                    ]}
                  >
                    {label}

                    {required && <Text style={styles.requiredMark}> *</Text>}
                  </Text>
                )}
              </>
            );
          }}
        </Pressable>

        {description && (
          <Text
            style={[
              styles.descriptionText,
              helperTextSizeStyle[size],
              disabled && styles.descriptionTextDisabled,
            ]}
          >
            {description}
          </Text>
        )}

        {hasError && (
          <Text style={[styles.errorText, helperTextSizeStyle[size]]}>
            {error}
          </Text>
        )}
      </View>
    );
  }
);

Checkbox.displayName = 'Checkbox';
