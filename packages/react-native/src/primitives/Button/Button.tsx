import { cloneElement, useState } from 'react';

import { ActivityIndicator, Pressable, Text } from 'react-native';

import { useTheme, useThemeStyles } from '../../theme';
import { devWarning } from '../../utils/devWarning';

import { createStyles } from './Button.styles';
import type { ButtonIconElement, ButtonProps } from './types';

const sizeMap: Record<
  NonNullable<ButtonProps['size']>,
  {
    px: number;
    py: number;
    height: number;
    fontSize: number;
    iconSize: number;
  }
> = {
  sm: {
    px: 12,
    py: 8,
    height: 36,
    fontSize: 12,
    iconSize: 16,
  },

  md: {
    px: 16,
    py: 12,
    height: 44,
    fontSize: 14,
    iconSize: 20,
  },

  lg: {
    px: 20,
    py: 16,
    height: 52,
    fontSize: 16,
    iconSize: 24,
  },
};

export function Button({
  children,
  color = 'primary',
  variant = 'solid',
  disabled = false,
  loading = false,
  loadingText,
  onPress,
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  iconOnly: iconOnlyProp = false,
  style,
  textStyle,
  accessibilityLabel,
  iconSize,
  testID,
}: ButtonProps) {
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles);
  const config = sizeMap[size];

  const variantTheme = theme.components.button[color][variant];
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isDisabled = disabled || loading;
  const iconOnly =
    iconOnlyProp || (!children && Boolean(leftIcon || rightIcon));
  const content = loading && loadingText ? loadingText : children;

  devWarning(
    !iconOnly || Boolean(accessibilityLabel),
    'Button: icon-only buttons must provide an accessibilityLabel.'
  );

  const stateTheme = isDisabled
    ? theme.components.button.disabled
    : isPressed
      ? variantTheme.pressed
      : isHovered
        ? variantTheme.hover
        : variantTheme.default;

  const contentColor = stateTheme.fg;
  const resolvedIconSize = iconSize ?? config.iconSize;

  const renderIcon = (icon: ButtonIconElement, iconColor: string) => {
    return cloneElement(icon, {
      color: iconColor,
      size: resolvedIconSize,
    });
  };

  return (
    <Pressable
      testID={testID}
      disabled={isDisabled}
      onPress={isDisabled ? undefined : onPress}
      accessibilityRole='button'
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityLabel={
        accessibilityLabel ??
        (typeof content === 'string' ? content : undefined)
      }
      onBlur={() => setIsFocused(false)}
      onFocus={() => setIsFocused(true)}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={({ pressed }) => {
        const pressedTheme =
          !isDisabled && pressed
            ? variantTheme.pressed
            : !isDisabled && isHovered
              ? variantTheme.hover
              : stateTheme;

        return [
          styles.button,
          {
            backgroundColor: pressedTheme.bg,
            borderColor: pressedTheme.border,
            paddingHorizontal: iconOnly ? 0 : config.px,
            paddingVertical: iconOnly ? 0 : config.py,
            width: iconOnly ? config.height : undefined,
            height: iconOnly ? config.height : undefined,
          },
          fullWidth && !iconOnly && styles.fullWidth,
          isDisabled && styles.disabled,
          pressed && !isDisabled && styles.pressed,
          isFocused && !isDisabled && styles.focused,
          style,
        ];
      }}
    >
      {loading && <ActivityIndicator size='small' color={contentColor} />}

      {!loading && leftIcon && renderIcon(leftIcon, contentColor)}

      {content && !iconOnly && (
        <Text
          style={[
            styles.text,
            {
              fontSize: config.fontSize,
              color: contentColor,
            },
            textStyle,
          ]}
        >
          {content}
        </Text>
      )}

      {!loading && rightIcon && renderIcon(rightIcon, contentColor)}
    </Pressable>
  );
}
