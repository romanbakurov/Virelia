import { forwardRef } from 'react';

import { useControllableState } from '@vellira-ui/core';
import { View } from 'react-native';

import { FormField } from '../../patterns/FormField';
import { useThemeStyles } from '../../theme';

import { createStyles } from './RadioGroup.styles';
import { RadioGroupProvider } from './RadioGroupContext';
import type { RadioGroupProps } from './types';

export const RadioGroup = forwardRef<View, RadioGroupProps>(
  (
    {
      value,
      defaultValue = '',
      onValueChange,
      disabled = false,
      required = false,
      size = 'md',
      orientation = 'vertical',
      label,
      description,
      error,
      children,
      style,
      itemsStyle,
      labelStyle,
      descriptionStyle,
      errorStyle,
      accessibilityLabel,
      accessibilityHint,
      ...rest
    },
    ref
  ) => {
    const styles = useThemeStyles(createStyles);

    const [selectedValue, setSelectedValue] = useControllableState({
      value,
      defaultValue,
      onChange: onValueChange,
    });

    const invalid = Boolean(error);

    const resolvedAccessibilityLabel =
      accessibilityLabel ?? (typeof label === 'string' ? label : undefined);

    const resolvedAccessibilityHint =
      (accessibilityHint ??
        [
          typeof description === 'string' ? description : undefined,
          required ? 'Required.' : undefined,
          typeof error === 'string' ? error : undefined,
        ]
          .filter(Boolean)
          .join(' ')) ||
      undefined;

    return (
      <FormField
        label={label}
        description={description}
        error={error}
        required={required}
        disabled={disabled}
        labelStyle={labelStyle}
        descriptionStyle={descriptionStyle}
        errorStyle={errorStyle}
        style={style}
      >
        <RadioGroupProvider
          value={{
            value: selectedValue,
            disabled,
            required,
            invalid,
            size,
            onValueChange: setSelectedValue,
          }}
        >
          <View
            {...rest}
            ref={ref}
            accessibilityRole='radiogroup'
            accessibilityLabel={resolvedAccessibilityLabel}
            accessibilityHint={resolvedAccessibilityHint}
            accessibilityState={{
              disabled,
            }}
            style={[
              styles.items,
              orientation === 'horizontal' && styles.horizontal,
              itemsStyle,
            ]}
          >
            {children}
          </View>
        </RadioGroupProvider>
      </FormField>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
