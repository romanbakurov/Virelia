import { cloneElement, isValidElement, useEffect } from 'react';

import type { ReactElement } from 'react';
import type { GestureResponderEvent, LayoutChangeEvent } from 'react-native';
import { Pressable, Text, View } from 'react-native';

import { useTheme, useThemeStyles } from '../../../theme';
import { useTabs } from '../internal/TabsContext';

import { createStyles, getTriggerStyle } from './TabsTrigger.styles';
import type { TabsTriggerChildProps, TabsTriggerProps } from './types';

export const TabsTrigger = ({
  value,
  children,
  asChild = false,
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
    mode,
    orientation,
    disabled: rootDisabled,
    setValue,
    registerTrigger,
    registerTriggerLayout,
  } = useTabs();
  const isDisabled = rootDisabled || Boolean(disabled);
  const isActive = selectedValue === value;
  const child =
    asChild && isValidElement<TabsTriggerChildProps>(children)
      ? (children as ReactElement<TabsTriggerChildProps>)
      : undefined;

  const visibleChildren = child ? child.props.children : children;
  const isPills = variant === 'pills';
  const isLine = variant === 'line';
  const isSegmented = variant === 'segmented';
  const isVertical = orientation === 'vertical';
  const isSm = size === 'sm';
  const isLg = size === 'lg';
  const isOnlyIcon = icon != null && visibleChildren == null && badge == null;
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

  const handlePress = (_event: GestureResponderEvent) => {
    if (isDisabled || isActive) return;

    setValue(value);
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

  const content = (
    <>
      {icon != null && <View style={styles.tabIcon}>{renderedIcon}</View>}

      {visibleChildren != null && (
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
          {visibleChildren}
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
              color: isDisabled ? theme.components.tabs.disabled.fg : state.fg,
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
            style={[styles.tabBadgeText, { color: palette.pills.active.fg }]}
          >
            {badge}
          </Text>
        </View>
      )}
    </>
  );

  const baseStyle = getTriggerStyle({
    styles,
    isSm,
    isLg,
    isOnlyIcon,
    isVertical,
    isPills,
    isSegmented,
    isLine,
    isActive,
    isDisabled,
    borderColor: state.border,
    backgroundColor: state.bg,
    segmentedActiveBorderColor: palette.segmented.active.border,
    style,
  });

  if (child) {
    return cloneElement(child, {
      accessibilityRole: mode === 'tabs' ? 'tab' : undefined,
      accessibilityState:
        mode === 'tabs'
          ? { selected: isActive, disabled: isDisabled }
          : { disabled: isDisabled },
      disabled: isDisabled,
      onLayout: (event: LayoutChangeEvent) => {
        child.props.onLayout?.(event);
        handleLayout(event);
      },
      onPress: (event: GestureResponderEvent) => {
        child.props.onPress?.(event);

        if (isDisabled) return;

        handlePress(event);
      },
      style: [baseStyle, child.props.style],
      children: content,
    });
  }

  return (
    <Pressable
      disabled={isDisabled}
      accessibilityRole={mode === 'tabs' ? 'tab' : undefined}
      accessibilityState={
        mode === 'tabs'
          ? { selected: isActive, disabled: isDisabled }
          : { disabled: isDisabled }
      }
      onPress={handlePress}
      onLayout={handleLayout}
      style={({ pressed }) =>
        getTriggerStyle({
          styles,
          isSm,
          isLg,
          isOnlyIcon,
          isVertical,
          isPills,
          isSegmented,
          isLine,
          isActive,
          isDisabled,
          borderColor: state.border,
          backgroundColor: pressed ? pressedState.bg : state.bg,
          segmentedActiveBorderColor: palette.segmented.active.border,
          style,
        })
      }
    >
      {content}
    </Pressable>
  );
};

TabsTrigger.displayName = 'Tabs.Trigger';
