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
  message,
  messageTone = 'neutral',
  messageLive = 'off',
  required = false,
  disabled = false,
  invalid = false,
  size = 'md',
  labelInfo,
  labelAction,
  optionalText,
  children,
  style,
  controlStyle,
  labelStyle,
  descriptionStyle,
  errorStyle,
  messageStyle,
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
  const messageId = !error && message ? `${controlId}-message` : undefined;
  const isInvalid = invalid || Boolean(error);
  const visibleMessage = error ?? message;
  const visibleTone = error ? 'danger' : messageTone;
  const contextValue = {
    controlId,
    labelId,
    descriptionId,
    errorId,
    messageId,
    description,
    error,
    message,
    required,
    disabled,
    invalid: isInvalid,
    size,
    ariaLabelledBy: labelId,
    ariaDescribedBy:
      [descriptionId, errorId, messageId].filter(Boolean).join(' ') ||
      undefined,
  };
  const messageToneStyle = {
    neutral: undefined,
    success: styles.messageSuccess,
    warning: styles.messageWarning,
    danger: styles.messageDanger,
  }[visibleTone];

  return (
    <View
      {...rest}
      accessibilityState={disabled ? { disabled: true } : undefined}
      style={[styles.root, { gap: sizeTokens.gap }, style]}
    >
      {(label || labelAction) && (
        <View style={[styles.labelRow, { gap: sizeTokens.gap }]}>
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

          {labelAction && <View style={styles.labelAction}>{labelAction}</View>}
        </View>
      )}

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

      {visibleMessage &&
        (typeof visibleMessage === 'string' ||
        typeof visibleMessage === 'number' ? (
          <Text
            accessibilityLiveRegion={
              error || messageLive === 'polite' ? 'polite' : undefined
            }
            style={[
              styles.message,
              {
                fontSize: sizeTokens.helperTextFontSize,
                lineHeight: sizeTokens.helperTextLineHeight,
              },
              messageToneStyle,
              disabled && styles.helperTextDisabled,
              error ? errorStyle : messageStyle,
            ]}
          >
            {visibleMessage}
          </Text>
        ) : (
          <View
            accessibilityLiveRegion={
              error || messageLive === 'polite' ? 'polite' : undefined
            }
          >
            {visibleMessage}
          </View>
        ))}
    </View>
  );
}
