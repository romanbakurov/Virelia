import { forwardRef } from 'react';

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

export const Checkbox = forwardRef<View, CheckboxProps>(
  (
    {
      label,
      checked,
      defaultChecked = false,
      disabled = false,
      required = false,
      indeterminate = false,
      size = 'md',
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

    const errorTextSizeStyle = {
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

    const resolvedAccessibilityHint = [accessibilityHint, error]
      .filter(Boolean)
      .join(' ');

    const accessibilityChecked = indeterminate ? 'mixed' : isChecked;

    const checkColor = disabled
      ? theme.components.checkbox.disabled.fg
      : theme.components.checkbox.checked.default.fg;

    devWarning(
      Boolean(resolvedAccessibilityLabel),
      'Checkbox: an accessible label must be provided through label or accessibilityLabel.'
    );

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
          style={[styles.wrapper, disabled && styles.disabled, style]}
        >
          <View
            style={[
              styles.box,
              boxSizeStyle[size],
              (isChecked || indeterminate) && styles.boxChecked,
              hasError && styles.boxError,
              disabled && styles.boxDisabled,
            ]}
          >
            {indeterminate ? (
              <View style={styles.indeterminateMark} />
            ) : (
              isChecked && (
                <Check size={iconSizeBySize[size]} color={checkColor} />
              )
            )}
          </View>

          {label && (
            <Text
              style={[
                styles.label,
                labelSizeStyle[size],
                disabled && styles.labelDisabled,
              ]}
            >
              {label}

              {required && <Text style={styles.requiredMark}> *</Text>}
            </Text>
          )}
        </Pressable>

        {hasError && (
          <Text style={[styles.errorText, errorTextSizeStyle[size]]}>
            {error}
          </Text>
        )}
      </View>
    );
  }
);

Checkbox.displayName = 'Checkbox';
