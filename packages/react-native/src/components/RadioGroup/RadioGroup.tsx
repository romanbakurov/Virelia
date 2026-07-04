import { useControllableState } from '@vellira-ui/core';
import { Pressable, Text, View } from 'react-native';

import { FormField } from '../../patterns/FormField';
import { useThemeStyles } from '../../theme';

import { createStyles } from './RadioGroup.styles';
import type { RadioGroupProps } from './types';

export function RadioGroup({
  label,
  description,
  value,
  defaultValue = '',
  onChange,
  options,
  required = false,
  disabled = false,
  error,
  orientation = 'vertical',
  style,
  optionStyle,
  labelStyle,
}: RadioGroupProps) {
  const styles = useThemeStyles(createStyles);

  const [selectedValue, setSelectedValue] = useControllableState({
    value,
    defaultValue,
    onChange,
  });

  return (
    <FormField
      label={label}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
    >
      <View
        accessibilityRole='radiogroup'
        accessibilityState={{ disabled }}
        style={[
          styles.group,
          orientation === 'horizontal' && styles.horizontal,
          style,
        ]}
      >
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          const isDisabled = disabled || !!option.disabled;

          return (
            <Pressable
              key={option.value}
              disabled={isDisabled}
              accessibilityRole='radio'
              accessibilityLabel={option.label}
              accessibilityState={{
                checked: isSelected,
                disabled: isDisabled,
              }}
              onPress={() => {
                if (isDisabled) return;

                setSelectedValue(option.value);
              }}
              style={[
                styles.option,
                isDisabled && styles.optionDisabled,
                optionStyle,
              ]}
            >
              <View
                style={[
                  styles.radio,
                  isSelected && styles.radioSelected,
                  isDisabled && styles.radioDisabled,
                ]}
              >
                {isSelected && (
                  <View
                    style={[styles.dot, isDisabled && styles.dotDisabled]}
                  />
                )}
              </View>

              <Text
                style={[
                  styles.label,
                  isSelected && styles.labelSelected,
                  isDisabled && styles.labelDisabled,
                  labelStyle,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </FormField>
  );
}

RadioGroup.displayName = 'RadioGroup';
