import { cloneElement, isValidElement } from 'react';

import { ChevronDown, Close } from '@vellira-ui/icons';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { useTheme, useThemeStyles } from '../../../theme';
import { createSelectSlot } from '../internal/SelectCollection';
import type { SelectTriggerSlotProps } from '../types';

import { createTriggerStyles } from './SelectTrigger.styles';
import type { SelectTriggerProps } from './types';

export const SelectTriggerSlot = createSelectSlot<SelectTriggerSlotProps>(
  'trigger',
  'Select.Trigger'
);

export function SelectTrigger({
  displayText,
  isPlaceholder,
  isOpen,
  size = 'md',
  color = 'primary',
  variant = 'outline',
  disabled = false,
  required = false,
  hasError = false,
  hasValue = false,
  loading = false,
  clearable = false,
  startIcon,
  endIcon,
  prefix,
  suffix,
  accessibilityLabel,
  accessibilityHint,
  nativeID,
  accessibilityLabelledBy,
  ariaDescribedBy,
  triggerStyle,
  textStyle,
  onPress,
  onClear,
}: SelectTriggerProps) {
  const { theme } = useTheme();
  const styles = useThemeStyles(createTriggerStyles);
  const palette = theme.components.select[color][variant];
  const triggerState = isOpen ? palette.focus : palette.default;
  const resolvedIconSize = size === 'lg' ? 18 : 16;

  const textSizeStyle = {
    sm: styles.textSm,
    md: styles.textMd,
    lg: styles.textLg,
  } as const;

  const resolvedAccessibilityHint =
    accessibilityHint ??
    (hasError
      ? 'Invalid selection. Opens a list of options'
      : required
        ? 'Required. Opens a list of options'
        : 'Opens a list of options');

  const iconColor = disabled
    ? theme.components.select.trigger.disabled.icon
    : triggerState.icon;

  const renderIcon = (icon: typeof startIcon) =>
    isValidElement(icon)
      ? cloneElement(icon, { color: iconColor, size: resolvedIconSize })
      : null;

  return (
    <Pressable
      nativeID={nativeID}
      disabled={disabled}
      accessibilityRole='button'
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={resolvedAccessibilityHint}
      accessibilityLabelledBy={accessibilityLabelledBy}
      aria-describedby={ariaDescribedBy}
      accessibilityState={{
        expanded: isOpen,
        disabled,
        selected: hasValue,
        busy: loading,
      }}
      onPress={onPress}
      style={[
        styles.trigger,
        {
          backgroundColor: triggerState.bg,
          borderColor: triggerState.border,
        },
        styles[size],
        isOpen && {
          shadowColor: theme.components.select[color].ring,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.16,
          shadowRadius: 6,
          elevation: 1,
        },
        hasError && {
          borderColor: theme.components.select.trigger.error.border,
        },
        disabled && {
          backgroundColor: theme.components.select.trigger.disabled.bg,
          borderColor: theme.components.select.trigger.disabled.border,
        },
        triggerStyle,
      ]}
    >
      {startIcon && (
        <View
          pointerEvents='none'
          style={styles.startIcon}
          accessibilityElementsHidden
          importantForAccessibility='no'
        >
          {renderIcon(startIcon)}
        </View>
      )}

      {prefix && <Text style={styles.affix}>{prefix}</Text>}

      <View style={styles.value}>
        {typeof displayText === 'string' || typeof displayText === 'number' ? (
          <Text
            numberOfLines={1}
            style={[
              styles.text,
              textSizeStyle[size],
              { color: triggerState.fg },
              isPlaceholder && { color: triggerState.placeholder },
              disabled && {
                color: theme.components.select.trigger.disabled.fg,
              },
              textStyle,
            ]}
          >
            {displayText}
          </Text>
        ) : (
          displayText
        )}
      </View>

      {suffix && <Text style={styles.affix}>{suffix}</Text>}

      {loading ? (
        <ActivityIndicator
          testID='select-loading-indicator'
          size='small'
          color={iconColor}
        />
      ) : clearable && hasValue && !disabled ? (
        <Pressable
          accessibilityRole='button'
          accessibilityLabel='Clear selection'
          hitSlop={8}
          onPress={onClear}
          style={styles.clearButton}
        >
          <Close
            width={14}
            height={14}
            color={theme.semantic.status.error.fg}
          />
        </Pressable>
      ) : endIcon ? (
        <View
          pointerEvents='none'
          style={styles.endIcon}
          accessibilityElementsHidden
          importantForAccessibility='no'
        >
          {renderIcon(endIcon)}
        </View>
      ) : (
        <View
          style={[styles.endIcon, isOpen && styles.iconOpen]}
          accessibilityElementsHidden
          importantForAccessibility='no'
        >
          <ChevronDown width={16} height={16} color={iconColor} />
        </View>
      )}
    </Pressable>
  );
}

SelectTrigger.displayName = 'SelectTrigger';
