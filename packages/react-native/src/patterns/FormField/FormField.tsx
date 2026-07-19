import { useId } from 'react';

import { Text, View } from 'react-native';

import { useTheme, useThemeStyles } from '../../theme';

import { createStyles } from './FormField.styles';
import { FormFieldContext } from './FormFieldContext';
import type { FormFieldProps } from './types';

export function FormField({
  id,
  label,
  description,
  error,
  required = false,
  disabled = false,
  invalid = false,
  size = 'md',
  labelInfo,
  optionalText,
  children,
  style,
  controlStyle,
  labelStyle,
  descriptionStyle,
  errorStyle,
  ...rest
}: FormFieldProps) {
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles);
  const sizeTokens = theme.components.formField.size[size];
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const labelId = label ? `${controlId}-label` : undefined;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const isInvalid = invalid || Boolean(error);
  const contextValue = {
    controlId,
    labelId,
    descriptionId,
    errorId,
    description,
    error,
    required,
    disabled,
    invalid: isInvalid,
    size,
    ariaLabelledBy: labelId,
    ariaDescribedBy:
      [descriptionId, errorId].filter(Boolean).join(' ') || undefined,
  };

  return (
    <View
      {...rest}
      accessibilityState={disabled ? { disabled: true } : undefined}
      style={[styles.root, { gap: sizeTokens.gap }, style]}
    >
      {label &&
        (typeof label === 'string' || typeof label === 'number' ? (
          <Text
            style={[
              styles.label,
              {
                fontSize: sizeTokens.labelFontSize,
                lineHeight: sizeTokens.labelLineHeight,
              },
              disabled && styles.labelDisabled,
              labelStyle,
            ]}
          >
            {label}

            {required && (
              <Text
                style={styles.required}
                accessible={false}
                importantForAccessibility='no'
              >
                {' *'}
              </Text>
            )}

            {!required && optionalText && (
              <Text
                style={[
                  styles.optional,
                  {
                    fontSize: sizeTokens.optionalFontSize,
                    lineHeight: sizeTokens.optionalLineHeight,
                  },
                ]}
              >
                {optionalText}
              </Text>
            )}

            {labelInfo && (
              <Text
                style={[
                  styles.labelInfo,
                  {
                    fontSize: sizeTokens.labelInfoFontSize,
                    lineHeight: sizeTokens.labelInfoSize,
                  },
                ]}
              >
                {labelInfo}
              </Text>
            )}
          </Text>
        ) : (
          <View style={styles.customLabel}>
            {label}

            {required && (
              <Text
                style={styles.required}
                accessible={false}
                importantForAccessibility='no'
              >
                *
              </Text>
            )}

            {!required && optionalText}
            {labelInfo}
          </View>
        ))}

      {description &&
        (typeof description === 'string' || typeof description === 'number' ? (
          <Text
            style={[
              styles.description,
              {
                fontSize: sizeTokens.descriptionFontSize,
                lineHeight: sizeTokens.descriptionLineHeight,
              },
              disabled && styles.descriptionDisabled,
              descriptionStyle,
            ]}
          >
            {description}
          </Text>
        ) : (
          description
        ))}

      <FormFieldContext.Provider value={contextValue}>
        <View style={[styles.control, { gap: sizeTokens.gap }, controlStyle]}>
          {children}
        </View>
      </FormFieldContext.Provider>

      {error &&
        (typeof error === 'string' || typeof error === 'number' ? (
          <Text
            accessibilityLiveRegion='polite'
            style={[
              styles.error,
              {
                fontSize: sizeTokens.helperTextFontSize,
                lineHeight: sizeTokens.helperTextLineHeight,
              },
              disabled && styles.helperTextDisabled,
              errorStyle,
            ]}
          >
            {error}
          </Text>
        ) : (
          <View accessibilityLiveRegion='polite'>{error}</View>
        ))}
    </View>
  );
}
