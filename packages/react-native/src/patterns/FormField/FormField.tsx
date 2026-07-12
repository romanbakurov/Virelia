import { Text, View } from 'react-native';

import { useThemeStyles } from '../../theme';

import { createStyles } from './FormField.styles';
import type { FormFieldProps } from './types';

export function FormField({
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
  ...rest
}: FormFieldProps) {
  const styles = useThemeStyles(createStyles);

  return (
    <View {...rest} style={[styles.root, style]}>
      {label &&
        (typeof label === 'string' || typeof label === 'number' ? (
          <Text
            style={[styles.label, disabled && styles.labelDisabled, labelStyle]}
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
          </View>
        ))}

      {description &&
        (typeof description === 'string' || typeof description === 'number' ? (
          <Text
            style={[
              styles.description,
              disabled && styles.descriptionDisabled,
              descriptionStyle,
            ]}
          >
            {description}
          </Text>
        ) : (
          description
        ))}

      <View style={[styles.control, controlStyle]}>{children}</View>

      {error &&
        (typeof error === 'string' || typeof error === 'number' ? (
          <Text
            accessibilityLiveRegion='polite'
            style={[styles.error, errorStyle]}
          >
            {error}
          </Text>
        ) : (
          <View accessibilityLiveRegion='polite'>{error}</View>
        ))}
    </View>
  );
}
