import { ChevronDown } from '@vellira-ui/icons';
import { Pressable, Text, View } from 'react-native';

import { useTheme, useThemeStyles } from '../../../theme';

import { createStyles } from './SelectTrigger.styles';
import type { SelectTriggerProps } from './types';

export function SelectTrigger({
  displayText,
  isPlaceholder,
  isOpen,
  size = 'md',
  disabled = false,
  required = false,
  hasError = false,
  accessibilityLabel,
  accessibilityHint,
  triggerStyle,
  textStyle,
  onPress,
}: SelectTriggerProps) {
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles);

  const textSizeStyle = {
    sm: styles.textSm,
    md: styles.textMd,
    lg: styles.textLg,
  } as const;

  const resolvedAccessibilityHint =
    accessibilityHint ??
    (hasError
      ? 'Invalid selection. Opens a picker'
      : required
        ? 'Required. Opens a picker'
        : 'Opens a picker');

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole='button'
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={resolvedAccessibilityHint}
      accessibilityState={{
        expanded: isOpen,
        disabled,
      }}
      onPress={onPress}
      style={[
        styles.trigger,
        styles[size],
        isOpen && styles.triggerOpen,
        hasError && styles.triggerError,
        disabled && styles.triggerDisabled,
        triggerStyle,
      ]}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.text,
          textSizeStyle[size],
          isPlaceholder && styles.placeholder,
          isOpen && styles.textOpen,
          disabled && styles.textDisabled,
          textStyle,
        ]}
      >
        {displayText}
      </Text>

      <View
        style={[styles.icon, isOpen && styles.iconOpen]}
        accessibilityElementsHidden
        importantForAccessibility='no'
      >
        <ChevronDown
          width={16}
          height={16}
          color={
            disabled
              ? theme.components.select.trigger.disabled.fg
              : theme.components.select.trigger.placeholder.fg
          }
        />
      </View>
    </Pressable>
  );
}

SelectTrigger.displayName = 'SelectTrigger';
