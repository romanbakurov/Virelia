import { cloneElement, isValidElement } from 'react';

import type { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useTheme, useThemeStyles } from '../../../theme';
import { useTabs } from '../TabsContext';

import { createStyles } from './Tab.styles';
import type { TabProps } from './types';

export const Tab = ({
  index,
  children,
  icon,
  disabled,
  style,
  textStyle,
}: TabProps) => {
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles);
  const { activeIndex, appearance, orientation, setActiveIndex } = useTabs();
  const isActive = activeIndex === index;
  const isPills = appearance === 'pills';
  const isUnderline = appearance === 'underline';
  const isDefault = appearance === 'default';
  const isVertical = orientation === 'vertical';

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
      disabled={disabled}
      accessibilityRole='tab'
      accessibilityState={{ selected: isActive, disabled }}
      onPress={() => {
        if (!disabled && !isActive) {
          setActiveIndex(index);
        }
      }}
      style={({ pressed }) => [
        styles.tab,
        isVertical && styles.tabVertical,

        isPills && styles.tabPills,
        isPills && isActive && styles.tabPillsActive,

        pressed && !disabled && styles.tabPressed,

        isDefault && isActive && styles.tabDefaultActive,

        disabled && styles.tabDisabled,
        style,
      ]}
    >
      {({ pressed }) => (
        <>
          {isUnderline && !isVertical && (
            <View
              pointerEvents='none'
              style={[
                styles.horizontalIndicator,
                isActive && styles.horizontalIndicatorActive,
              ]}
            />
          )}

          {isUnderline && isVertical && (
            <View
              pointerEvents='none'
              style={[
                styles.verticalIndicator,
                isActive && styles.verticalIndicatorActive,
                pressed &&
                  !isActive &&
                  !disabled &&
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
                disabled && styles.tabTextDisabled,
                textStyle,
              ]}
            >
              {children}
            </Text>
          )}
        </>
      )}
    </Pressable>
  );
};

Tab.displayName = 'Tab';
