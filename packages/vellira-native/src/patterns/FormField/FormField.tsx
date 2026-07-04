import { forwardRef } from 'react';

import { Text, View } from 'react-native';

import { useThemeStyles } from '../../theme';

import { createStyles } from './FormField.styles';
import type { FormFieldProps } from './types';

export const FormField = forwardRef<View, FormFieldProps>(
  (
    {
      label,
      description,
      error,
      required = false,
      disabled = false,
      children,
      style,
      controlStyle,
      labelStyle,
      descriptionStyle,
      errorStyle,
      testID,
    },
    ref
  ) => {
    const styles = useThemeStyles(createStyles);

    return (
      <View
        ref={ref}
        testID={testID}
        style={[styles.root, style]}
        accessibilityState={{
          disabled,
        }}
      >
        {label && (
          <Text
            style={[styles.label, disabled && styles.labelDisabled, labelStyle]}
          >
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        )}

        {description && (
          <Text
            style={[
              styles.description,
              disabled && styles.descriptionDisabled,
              descriptionStyle,
            ]}
          >
            {description}
          </Text>
        )}

        <View style={[styles.control, controlStyle]}>{children}</View>

        {error && (
          <Text
            style={[styles.error, errorStyle]}
            accessibilityRole='alert'
            accessibilityLiveRegion='polite'
          >
            {error}
          </Text>
        )}
      </View>
    );
  }
);

FormField.displayName = 'FormField';
