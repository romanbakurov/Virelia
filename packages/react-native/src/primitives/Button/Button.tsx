import { cloneElement, useState } from 'react';

import { Pressable, Text } from 'react-native';

import { useTheme, useThemeStyles } from '../../theme';

import { createStyles } from './Button.styles';
import type { ButtonIconElement, ButtonProps } from './types';

const sizeMap: Record<
  NonNullable<ButtonProps['size']>,
  {
    px: number;
    py: number;
    fontSize: number;
    iconSize: number;
  }
> = {
  sm: {
    px: 12,
    py: 8,
    fontSize: 12,
    iconSize: 16,
  },

  md: {
    px: 16,
    py: 12,
    fontSize: 14,
    iconSize: 20,
  },

  lg: {
    px: 20,
    py: 16,
    fontSize: 16,
    iconSize: 24,
  },
};

export function Button({
  children,
  disabled = false,
  onPress,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
  accessibilityLabel,
  iconSize,
}: ButtonProps) {
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles);
  const config = sizeMap[size];
  const variantTheme = theme.components.button[variant];
  const [isPressed, setIsPressed] = useState(false);

  const iconOnly = !children && Boolean(leftIcon || rightIcon);

  if (iconOnly && !accessibilityLabel) {
    console.warn(
      'Vellira Button: icon-only buttons must provide an accessibilityLabel.'
    );
  }

  const contentColor = disabled
    ? theme.components.button.disabled.fg
    : isPressed
      ? variantTheme.pressed.fg
      : variantTheme.default.fg;
  const resolvedIconSize = iconSize ?? config.iconSize;

  const renderIcon = (icon: ButtonIconElement, color: string) => {
    return cloneElement(icon, {
      color,
      size: resolvedIconSize,
    });
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      accessibilityLabel={
        accessibilityLabel ??
        (typeof children === 'string' ? children : undefined)
      }
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: disabled
            ? theme.components.button.disabled.bg
            : pressed
              ? variantTheme.pressed.bg
              : variantTheme.default.bg,
          paddingHorizontal: iconOnly ? config.py : config.px,
          paddingVertical: config.py,
        },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {leftIcon && renderIcon(leftIcon, contentColor)}
      {children && (
        <Text
          style={[
            styles.text,
            {
              fontSize: config.fontSize,
              color: contentColor,
            },
          ]}
        >
          {children}
        </Text>
      )}
      {rightIcon && renderIcon(rightIcon, contentColor)}
    </Pressable>
  );
}
