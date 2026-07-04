import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from 'react';

import { ChevronDown } from '@vellira-ui/icons';
import type { ReactElement, ReactNode } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { useTheme, useThemeStyles } from '../../../theme';

import { createStyles } from './DropdownTrigger.styles';
import type { DropdownTriggerProps } from './types';

export function DropdownTrigger({
  label,
  trigger,
  icon,
  arrowIcon,
  showArrow = true,
  disabled = false,
  isOpen,
  triggerStyle,
  onPress,
}: DropdownTriggerProps) {
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles);
  const hasIcon = Boolean(icon);
  const isIconOnly = !trigger && hasIcon && !showArrow;
  const [isPressed, setIsPressed] = useState(false);
  const rotateAnim = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [isOpen, rotateAnim]);

  const arrowRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const renderColoredNode = (node: ReactNode, color: string) => {
    if (typeof node === 'string' || typeof node === 'number') {
      return (
        <Text
          numberOfLines={1}
          style={[
            styles.triggerText,
            { color },
            disabled && styles.triggerTextDisabled,
          ]}
        >
          {node}
        </Text>
      );
    }

    if (!isValidElement(node)) return node;

    return cloneElement(node as ReactElement<{ color?: string }>, { color });
  };

  const contentColor = disabled
    ? theme.components.dropdown.trigger.disabled.fg
    : isPressed
      ? theme.components.dropdown.trigger.hover.fg
      : theme.components.dropdown.trigger.default.fg;

  const arrow = arrowIcon ? (
    renderColoredNode(arrowIcon, contentColor)
  ) : (
    <ChevronDown width={16} height={16} color={contentColor} />
  );

  const renderedIcon = icon ? renderColoredNode(icon, contentColor) : null;

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole='button'
      accessibilityLabel={label}
      accessibilityState={{ expanded: isOpen, disabled }}
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[
        styles.trigger,
        isPressed && !disabled && styles.triggerPressed,
        disabled && styles.triggerDisabled,
        isIconOnly && styles.iconOnly,
        triggerStyle,
      ]}
    >
      {hasIcon && <View style={styles.icon}>{renderedIcon}</View>}

      {!isIconOnly &&
        (trigger ? (
          renderColoredNode(trigger, contentColor)
        ) : (
          <Text
            numberOfLines={1}
            style={[
              styles.triggerText,
              { color: contentColor },
              disabled && styles.triggerTextDisabled,
            ]}
          >
            {label}
          </Text>
        ))}

      {showArrow && (
        <Animated.View
          style={[styles.arrow, { transform: [{ rotate: arrowRotate }] }]}
        >
          {arrow}
        </Animated.View>
      )}
    </Pressable>
  );
}

DropdownTrigger.displayName = 'DropdownTrigger';
