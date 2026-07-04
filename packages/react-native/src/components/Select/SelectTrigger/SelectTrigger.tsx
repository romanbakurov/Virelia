import { ChevronDown } from '@vellira-ui/icons';
import { Pressable, Text, View } from 'react-native';

import { useTheme, useThemeStyles } from '../../../theme';

import { createStyles } from './SelectTrigger.styles';
import type { SelectTriggerProps } from './types';

export function SelectTrigger({
  displayText,
  isPlaceholder,
  isOpen,
  disabled = false,
  hasError = false,
  accessibilityLabel,
  triggerStyle,
  textStyle,
  onPress,
}: SelectTriggerProps) {
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles);

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole='button'
      accessibilityLabel={accessibilityLabel}
      accessibilityHint='Opens a picker'
      accessibilityState={{
        expanded: isOpen,
        disabled,
      }}
      onPress={onPress}
      style={[
        styles.trigger,
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
          isPlaceholder && styles.placeholder,
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
