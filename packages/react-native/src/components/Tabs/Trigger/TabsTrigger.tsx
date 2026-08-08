import { cloneElement, isValidElement, useEffect } from 'react';

import type { ReactElement } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Pressable, Text, View } from 'react-native';

import { useTheme, useThemeStyles } from '../../../theme';
import { useTabs } from '../internal/TabsContext';

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
    color,
    size,
    orientation,
    disabled: rootDisabled,
    setValue,
    registerTrigger,
    registerTriggerLayout,
  } = useTabs();
  const isDisabled = rootDisabled || disabled;
  const isActive = selectedValue === value;
  const isPills = variant === 'pills';
  const isLine = variant === 'line';
  const isSegmented = variant === 'segmented';
  const isVertical = orientation === 'vertical';
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  const isOnlyIcon = icon != null && children == null && badge == null;
  const palette = theme.components.tabs[color];
  const state = isDisabled
    ? theme.components.tabs.disabled
    : isPills
      ? isActive
        ? palette.pills.active
        : palette.pills.default
      : isActive
        ? palette.trigger.active
        : palette.trigger.default;
  const pressedState = isDisabled
    ? state
    : isPills
      ? isActive
        ? palette.pills.active
        : palette.pills.hover
      : isActive
        ? palette.trigger.active
        : palette.trigger.hover;

  useEffect(() => {
    registerTrigger(value, Boolean(isDisabled), true);

    return () => {
      registerTrigger(value, Boolean(isDisabled), false);
      registerTriggerLayout(value, undefined);
    };
  }, [isDisabled, registerTrigger, registerTriggerLayout, value]);

  const handleLayout = (event: LayoutChangeEvent) => {
    registerTriggerLayout(value, event.nativeEvent.layout);
  };

  const iconColor =
    isPills && isActive
      ? palette.pills.active.fg
      : isActive
        ? palette.trigger.active.fg
        : state.fg;

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
      onLayout={handleLayout}
      style={({ pressed }) => [
        styles.tab,
        isSm && styles.tabSm,
        isLg && styles.tabLg,
        isOnlyIcon && styles.tabIconOnly,
        isOnlyIcon && isSm && styles.tabIconOnlySm,
        isOnlyIcon && isLg && styles.tabIconOnlyLg,
        isVertical && styles.tabVertical,

        isPills && styles.tabPills,
        isPills && isOnlyIcon && styles.tabPillsIconOnly,
        isSegmented && styles.tabSegmented,
        isSegmented && isSm && styles.tabSegmentedSm,
        isSegmented && isLg && styles.tabSegmentedLg,
        isSegmented && isOnlyIcon && styles.tabSegmentedIconOnly,
        isSegmented && isOnlyIcon && isSm && styles.tabSegmentedIconOnlySm,
        isSegmented && isOnlyIcon && isLg && styles.tabSegmentedIconOnlyLg,

        {
          borderColor: isLine ? 'transparent' : state.border,
          backgroundColor: pressed ? pressedState.bg : state.bg,
        },

        isSegmented &&
          isActive && {
            borderColor: palette.segmented.active.border,
            backgroundColor: 'transparent',
          },

        isPills &&
          isActive && {
            borderColor: 'transparent',
            backgroundColor: 'transparent',
          },

        isDisabled && styles.tabDisabled,
        style,
      ]}
    >
      {() => (
        <>
          {icon != null && <View style={styles.tabIcon}>{renderedIcon}</View>}

          {children != null && (
            <Text
              numberOfLines={2}
              ellipsizeMode='tail'
              style={[
                styles.tabText,
                isSm && styles.tabTextSm,
                isLg && styles.tabTextLg,
                {
                  color:
                    isSegmented && isActive
                      ? palette.segmented.active.fg
                      : state.fg,
                },
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
              style={[
                styles.tabText,
                styles.tabDescription,
                isSm && styles.tabTextSm,
                isLg && styles.tabTextLg,
                {
                  color: isDisabled
                    ? theme.components.tabs.disabled.fg
                    : state.fg,
                },
              ]}
            >
              {description}
            </Text>
          )}

          {badge != null && (
            <View
              style={[
                styles.tabBadge,
                isLg && styles.tabBadgeLg,
                {
                  backgroundColor: palette.pills.active.bg,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabBadgeText,
                  { color: palette.pills.active.fg },
                ]}
              >
                {badge}
              </Text>
            </View>
          )}
        </>
      )}
    </Pressable>
  );
};

TabsTrigger.displayName = 'Tabs.Trigger';
