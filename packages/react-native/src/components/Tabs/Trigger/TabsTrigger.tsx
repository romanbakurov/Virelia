import { cloneElement, isValidElement, useEffect } from 'react';

import type { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useTheme, useThemeStyles } from '../../../theme';
import { useTabs } from '../TabsContext';

import { createStyles } from './TabsTrigger.styles';
import type { TabsTriggerProps } from './types';

export const TabsTrigger = ({
  value,
  children,
  icon,
  badge,
  description,
  disabled,
  style,
  textStyle,
}: TabsTriggerProps) => {
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles);
  const {
    value: selectedValue,
    variant,
    orientation,
    disabled: rootDisabled,
    setValue,
    registerTrigger,
  } = useTabs();
  const isDisabled = rootDisabled || disabled;
  const isActive = selectedValue === value;
  const isPills = variant === 'pills';
  const isLine = variant === 'line';
  const isSegmented = variant === 'segmented';
  const isVertical = orientation === 'vertical';

  useEffect(() => {
    registerTrigger(value, Boolean(isDisabled), true);

    return () => {
      registerTrigger(value, Boolean(isDisabled), false);
    };
  }, [isDisabled, registerTrigger, value]);

  const iconColor =
    isPills && isActive
      ? theme.components.tabs.pills.active.fg
      : isActive
        ? theme.components.tabs.trigger.active.fg
        : theme.components.tabs.trigger.default.fg;

  const renderedIcon = isValidElement(icon)
    ? cloneElement(icon as ReactElement<{ color?: string }>, {
        color: iconColor,
      })
    : icon;

  return (
    <Pressable
      disabled={isDisabled}
      accessibilityRole='tab'
      accessibilityState={{ selected: isActive, disabled: isDisabled }}
      onPress={() => {
        if (!isDisabled && !isActive) {
          setValue(value);
        }
      }}
      style={({ pressed }) => [
        styles.tab,
        isVertical && styles.tabVertical,

        isPills && styles.tabPills,
        isPills && isActive && styles.tabPillsActive,

        pressed && !isDisabled && styles.tabPressed,

        isSegmented && isActive && styles.tabDefaultActive,

        isDisabled && styles.tabDisabled,
        style,
      ]}
    >
      {({ pressed }) => (
        <>
          {isLine && !isVertical && (
            <View
              pointerEvents='none'
              style={[
                styles.horizontalIndicator,
                isActive && styles.horizontalIndicatorActive,
              ]}
            />
          )}

          {isLine && isVertical && (
            <View
              pointerEvents='none'
              style={[
                styles.verticalIndicator,
                isActive && styles.verticalIndicatorActive,
                pressed &&
                  !isActive &&
                  !isDisabled &&
                  styles.verticalIndicatorPressed,
              ]}
            />
          )}

          {icon != null && <View style={styles.tabIcon}>{renderedIcon}</View>}

          {children != null && (
            <Text
              numberOfLines={2}
              ellipsizeMode='tail'
              style={[
                styles.tabText,
                isPills && isActive && styles.tabTextPillsActive,
                !isPills && isActive && styles.tabTextActive,
                isDisabled && styles.tabTextDisabled,
                textStyle,
              ]}
            >
              {children}
            </Text>
          )}

          {description != null && (
            <Text
              numberOfLines={2}
              ellipsizeMode='tail'
              style={[styles.tabText, styles.tabDescription]}
            >
              {description}
            </Text>
          )}

          {badge != null && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{badge}</Text>
            </View>
          )}
        </>
      )}
    </Pressable>
  );
};

TabsTrigger.displayName = 'Tabs.Trigger';
