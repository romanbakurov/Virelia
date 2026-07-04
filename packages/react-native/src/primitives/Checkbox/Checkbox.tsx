import { forwardRef } from 'react';

import { useControllableState } from '@vellira-ui/core';
import { Check } from '@vellira-ui/icons';
import { Pressable, Text, View } from 'react-native';

import { useTheme, useThemeStyles } from '../../theme';

import { createStyles } from './Checkbox.styles';
import type { CheckboxProps } from './types';

export const Checkbox = forwardRef<View, CheckboxProps>(
  (
    {
      label,
      checked,
      defaultChecked = false,
      disabled = false,
      onCheckedChange,
      error,
      style,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const styles = useThemeStyles(createStyles);
    const hasError = Boolean(error);

    const [isChecked, setIsChecked] = useControllableState({
      value: checked,
      defaultValue: defaultChecked,
      onChange: onCheckedChange,
    });

    const handlePress = () => {
      if (disabled) return;
      setIsChecked(!isChecked);
    };

    const checkColor = disabled
      ? theme.components.checkbox.disabled.fg
      : theme.components.checkbox.checked.default.fg;

    return (
      <View style={styles.container}>
        <Pressable
          ref={ref}
          onPress={handlePress}
          disabled={disabled}
          accessibilityRole='checkbox'
          accessibilityState={{
            checked: isChecked,
            disabled,
          }}
          accessibilityHint={hasError ? error : undefined}
          accessibilityLabel={label ?? 'Checkbox'}
          style={[styles.wrapper, disabled && styles.disabled, style]}
          {...props}
        >
          <View
            style={[
              styles.box,
              isChecked && styles.boxChecked,
              hasError && styles.boxError,
              disabled && styles.boxDisabled,
            ]}
          >
            {isChecked && <Check size={12} color={checkColor} />}
          </View>

          {label && (
            <Text style={[styles.label, disabled && styles.labelDisabled]}>
              {label}
            </Text>
          )}
        </Pressable>

        {hasError && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

Checkbox.displayName = 'Checkbox';
