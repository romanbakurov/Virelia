import { forwardRef } from 'react';

import { ChevronDown } from '@romanbakurov/vellira-icons';
import { Pressable, Text, View } from 'react-native';

import { useTheme, useThemeStyles } from '../../../theme';

import { createStyles } from './SelectTrigger.styles';
import type { SelectTriggerProps } from './types';

export const SelectTrigger = forwardRef<View, SelectTriggerProps>(
  (
    {
      displayText,
      size = 'md',
      isPlaceholder,
      isOpen,
      disabled = false,
      hasError = false,
      accessibilityLabel,
      triggerStyle,
      textStyle,
      onPress,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const styles = useThemeStyles(createStyles);
    const triggerSizeStyle = {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    }[size];
    const textSizeStyle = {
      sm: styles.smText,
      md: styles.mdText,
      lg: styles.lgText,
    }[size];

    return (
      <Pressable
        {...props}
        ref={ref}
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
          triggerSizeStyle,
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
            textSizeStyle,
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
);

SelectTrigger.displayName = 'SelectTrigger';
