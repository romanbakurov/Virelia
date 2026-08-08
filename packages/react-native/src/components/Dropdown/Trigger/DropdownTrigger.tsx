import {
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from 'react';

import { ChevronDown } from '@vellira-ui/icons';
import type { ReactElement, ReactNode } from 'react';
import { Animated, Platform, Pressable, Text, View } from 'react-native';

import { useTheme, useThemeStyles } from '../../../theme';
import { useDropdownContext } from '../internal/DropdownContext';

import { createStyles } from './DropdownTrigger.styles';
import type { DropdownTriggerProps } from './types';

export function DropdownTrigger({
  asChild = false,
  label,
  trigger,
  children,
  icon,
  arrowIcon,
  showArrow = true,
  triggerStyle,
  triggerRef,
  accessibilityLabel,
  accessibilityHint,
}: DropdownTriggerProps) {
  const { open, color, disabled, size, toggle } = useDropdownContext();
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles);
  const colorPalette = theme.components.dropdown[color];
  const textSizeStyle = {
    sm: styles.textSm,
    md: styles.textMd,
    lg: styles.textLg,
  }[size];
  const iconOnlySizeStyle = {
    sm: styles.smIconOnly,
    md: styles.mdIconOnly,
    lg: styles.lgIconOnly,
  }[size];
  const hasIcon = Boolean(icon);
  const isIconOnly = !trigger && hasIcon && !showArrow;
  const [isPressed, setIsPressed] = useState(false);
  const rotateAnim = useRef(new Animated.Value(open ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: open ? 1 : 0,
      duration: 180,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [open, rotateAnim]);

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
            textSizeStyle,
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
      ? colorPalette.trigger.hover.fg
      : colorPalette.trigger.default.fg;

  const arrow = arrowIcon ? (
    renderColoredNode(arrowIcon, contentColor)
  ) : (
    <ChevronDown width={16} height={16} color={contentColor} />
  );

  const renderedIcon = icon ? renderColoredNode(icon, contentColor) : null;
  const triggerContent = trigger ?? children;

  if (asChild && isValidElement(triggerContent)) {
    const child = triggerContent as ReactElement<{
      accessibilityHint?: string;
      accessibilityLabel?: string;
      accessibilityState?: object;
      disabled?: boolean;
      onPress?: () => void;
      ref?: (node: unknown) => void;
    }>;
    const isChildDisabled = disabled || child.props.disabled;

    return cloneElement(child, {
      ref: triggerRef,
      disabled: isChildDisabled,
      accessibilityLabel:
        accessibilityLabel ?? (typeof label === 'string' ? label : undefined),
      accessibilityHint,
      accessibilityState: { expanded: open, disabled: isChildDisabled },
      onPress: () => {
        child.props.onPress?.();

        if (!isChildDisabled) {
          toggle();
        }
      },
    });
  }

  return (
    <Pressable
      ref={triggerRef}
      disabled={disabled}
      accessibilityRole='button'
      accessibilityLabel={
        accessibilityLabel ?? (typeof label === 'string' ? label : undefined)
      }
      accessibilityHint={accessibilityHint}
      accessibilityState={{ expanded: open, disabled }}
      onPress={toggle}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[
        styles.trigger,
        styles[size],
        {
          backgroundColor: colorPalette.trigger.default.bg,
          borderColor: colorPalette.trigger.default.border,
        },
        isIconOnly && styles.iconOnly,
        isIconOnly && iconOnlySizeStyle,
        isPressed &&
          !disabled && {
            backgroundColor: colorPalette.trigger.hover.bg,
            borderColor: colorPalette.trigger.hover.border,
          },
        disabled && styles.triggerDisabled,
        triggerStyle,
      ]}
    >
      {hasIcon && <View style={styles.icon}>{renderedIcon}</View>}

      {!isIconOnly &&
        (triggerContent ? (
          renderColoredNode(triggerContent, contentColor)
        ) : (
          <Text
            numberOfLines={1}
            style={[
              styles.triggerText,
              textSizeStyle,
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
