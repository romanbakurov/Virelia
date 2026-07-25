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
    color,
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
    };
  }, [isDisabled, registerTrigger, value]);

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
      style={({ pressed }) => [
        styles.tab,
        isVertical && styles.tabVertical,

        isPills && styles.tabPills,
        isSegmented && styles.tabSegmented,
        isPills &&
          isActive && {
            borderColor: palette.pills.active.border,
            backgroundColor: palette.pills.active.bg,
          },

        {
          borderColor: state.border,
          backgroundColor: pressed ? pressedState.bg : state.bg,
        },

        isSegmented &&
          isActive && {
            borderColor: palette.segmented.active.border,
            backgroundColor: palette.segmented.active.bg,
          },

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
                isActive && {
                  backgroundColor: palette.indicator.bg,
                },
              ]}
            />
          )}

          {isLine && isVertical && (
            <View
              pointerEvents='none'
              style={[
                styles.verticalIndicator,
                isActive && {
                  backgroundColor: palette.indicator.bg,
                },
                pressed &&
                  !isActive &&
                  !isDisabled && {
                    backgroundColor: palette.indicator.hoverBg,
                  },
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
