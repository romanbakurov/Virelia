import { cloneElement, isValidElement } from 'react';

import { ChevronDown, Close } from '@vellira-ui/icons';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';

import { useTheme, useThemeStyles } from '../../../theme';
import { createSelectSlot } from '../internal/SelectCollection';
import type { SelectTriggerSlotProps } from '../types';

import { createTriggerStyles } from './SelectTrigger.styles';
import type { SelectTriggerProps } from './types';

export const SelectTriggerSlot = createSelectSlot<SelectTriggerSlotProps>(
  'trigger',
  'Select.Trigger'
);

const nativePointerEventsNone =
  Platform.OS === 'web' ? undefined : ({ pointerEvents: 'none' } as const);
const nativePointerEventsBoxNone =
  Platform.OS === 'web' ? undefined : ({ pointerEvents: 'box-none' } as const);
const webPointerEventsNone =
  Platform.OS === 'web' ? { pointerEvents: 'none' as const } : undefined;
const webPointerEventsBoxNone =
  Platform.OS === 'web' ? { pointerEvents: 'box-none' as const } : undefined;

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

  const showClearButton = clearable && hasValue && !disabled && !loading;
  const openRingStyle =
    Platform.OS === 'web'
      ? {
          boxShadow: `0 0 0 3px ${theme.components.select[color].ring}`,
        }
      : {
          shadowColor: theme.components.select[color].ring,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.16,
          shadowRadius: 6,
          elevation: 1,
        };

  const triggerWithClearStyle = {
    sm: styles.triggerWithClearSm,
    md: styles.triggerWithClearMd,
    lg: styles.triggerWithClearLg,
  } as const;

  const clearButtonContainerStyle = {
    sm: styles.clearButtonContainerSm,
    md: styles.clearButtonContainerMd,
    lg: styles.clearButtonContainerLg,
  } as const;

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

  const renderValue = () => {
    const valueStyle = [
      styles.text,
      textSizeStyle[size],
      { color: triggerState.fg },
      isPlaceholder && { color: triggerState.placeholder },
      disabled && {
        color: theme.components.select.trigger.disabled.fg,
      },
      textStyle,
    ];

    if (typeof displayText === 'string' || typeof displayText === 'number') {
      return (
        <Text numberOfLines={1} style={valueStyle}>
          {displayText}
        </Text>
      );
    }

    if (
      isValidElement<{ style?: object; numberOfLines?: number }>(displayText) &&
      displayText.type === Text
    ) {
      return cloneElement(displayText, {
        numberOfLines: displayText.props.numberOfLines ?? 1,
        style: [valueStyle, displayText.props.style],
      });
    }

    return displayText;
  };

  return (
    <View style={styles.container}>
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
          showClearButton && triggerWithClearStyle[size],
          isOpen && openRingStyle,
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
            {...nativePointerEventsNone}
            style={[styles.startIcon, webPointerEventsNone]}
            accessibilityElementsHidden
            importantForAccessibility='no'
          >
            {renderIcon(startIcon)}
          </View>
        )}

        {prefix && <Text style={styles.affix}>{prefix}</Text>}

        <View style={styles.value}>{renderValue()}</View>

        {suffix && <Text style={styles.affix}>{suffix}</Text>}

        {loading ? (
          <ActivityIndicator
            testID='select-loading-indicator'
            size='small'
            color={iconColor}
          />
        ) : showClearButton ? null : endIcon ? (
          <View
            {...nativePointerEventsNone}
            style={[styles.endIcon, webPointerEventsNone]}
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

      {showClearButton && (
        <View
          {...nativePointerEventsBoxNone}
          style={[
            styles.clearButtonContainer,
            clearButtonContainerStyle[size],
            webPointerEventsBoxNone,
          ]}
        >
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
              color={theme.components.select.clearButton.hoverFg}
            />
          </Pressable>
        </View>
      )}
    </View>
  );
}

SelectTrigger.displayName = 'SelectTrigger';
