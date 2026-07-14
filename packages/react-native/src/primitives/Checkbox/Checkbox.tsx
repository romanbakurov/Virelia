import { forwardRef } from 'react';

import { useControllableState } from '@vellira-ui/core';
import { Check } from '@vellira-ui/icons';
import { Pressable, Text, View } from 'react-native';

import { useTheme, useThemeStyles } from '../../theme';

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
      description,
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
                ? theme.components.checkbox.checked.pressed.fg
                : theme.components.checkbox.checked.default.fg;

            return (
              <>
                <View
                  style={[
                    styles.box,
                    boxSizeStyle[size],
                    isSelected && styles.boxChecked,
                    isSelected && pressed && styles.boxCheckedPressed,
                    hasError && styles.boxError,
                    disabled && styles.boxDisabled,
                  ]}
                >
                  {indeterminate ? (
                    <View
                      style={[
                        styles.indeterminateMark,
                        pressed && styles.indeterminateMarkPressed,
                      ]}
                    />
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
                      isSelected && styles.labelChecked,
                      isSelected && pressed && styles.labelCheckedPressed,
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
