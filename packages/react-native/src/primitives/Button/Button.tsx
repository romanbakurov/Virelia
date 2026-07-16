import { cloneElement, useState } from 'react';

import type { LayoutChangeEvent, PressableProps } from 'react-native';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

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
  appearance = 'solid',
  shape = 'pill',
  disabled = false,
  loading = false,
  loadingText,
  onPress,
  onFocus,
  onBlur,
  onHoverIn,
  onHoverOut,
  size = 'md',
  iconStart,
  iconEnd,
  badge,
  shortcut,
  fullWidth = false,
  iconOnly: iconOnlyProp = false,
  style,
  textStyle,
  accessibilityLabel,
  iconSize,
  testID,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles);
  const config = sizeMap[size];
  const radius =
    shape === 'square'
      ? theme.tokens.radius.sm
      : shape === 'rounded'
        ? theme.tokens.radius.md
        : theme.tokens.radius.full;

  const appearanceTheme = theme.components.button[color][appearance];

  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [labelWidth, setLabelWidth] = useState(0);

  const isDisabled = disabled || loading;
  const iconOnly = iconOnlyProp || (!children && Boolean(iconStart || iconEnd));
  const content = loading && loadingText ? loadingText : children;
  const measureLabel =
    loadingText && children && !iconOnly
      ? loading
        ? children
        : loadingText
      : undefined;

  devWarning(
    !iconOnly || Boolean(accessibilityLabel),
    'Button: icon-only buttons must provide an accessibilityLabel.'
  );

  const resolvedIconSize = iconSize ?? config.iconSize;

  const handleFocus: NonNullable<PressableProps['onFocus']> = (event) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur: NonNullable<PressableProps['onBlur']> = (event) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  const handleHoverIn: NonNullable<PressableProps['onHoverIn']> = (event) => {
    setIsHovered(true);
    onHoverIn?.(event);
  };

  const handleHoverOut: NonNullable<PressableProps['onHoverOut']> = (event) => {
    setIsHovered(false);
    onHoverOut?.(event);
  };

  const renderIcon = (icon: ButtonIconElement, iconColor: string) =>
    cloneElement(icon, {
      color: iconColor,
      size: resolvedIconSize,
    });

  const handleLabelLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;

    setLabelWidth((currentWidth) =>
      width > currentWidth ? width : currentWidth
    );
  };

  const getInteractionTheme = (pressed: boolean) =>
    isDisabled
      ? theme.components.button.disabled
      : pressed
        ? appearanceTheme.pressed
        : isHovered
          ? appearanceTheme.hover
          : appearanceTheme.default;

  return (
    <Pressable
      {...props}
      testID={testID}
      disabled={isDisabled}
      onPress={isDisabled ? undefined : onPress}
      accessibilityRole='button'
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityLabel={
        accessibilityLabel ??
        (typeof content === 'string' ? content : undefined)
      }
      onBlur={handleBlur}
      onFocus={handleFocus}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      style={({ pressed }) => {
        const interactionTheme = getInteractionTheme(pressed);

        return [
          styles.button,
          {
            backgroundColor: interactionTheme.bg,
            borderColor: interactionTheme.border,
            borderRadius: radius,
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
      {({ pressed }) => {
        const interactionTheme = getInteractionTheme(pressed);
        const contentColor = interactionTheme.fg;

        return (
          <>
            {loading && <ActivityIndicator size='small' color={contentColor} />}

            {!loading && iconStart && renderIcon(iconStart, contentColor)}

            {content && !iconOnly && (
              <View style={styles.labelSlot}>
                <Text
                  onLayout={handleLabelLayout}
                  style={[
                    styles.text,
                    labelWidth > 0 && { minWidth: labelWidth },
                    {
                      fontSize: config.fontSize,
                      color: contentColor,
                    },
                    textStyle,
                  ]}
                >
                  {content}
                </Text>

                {measureLabel && (
                  <Text
                    accessibilityElementsHidden
                    importantForAccessibility='no-hide-descendants'
                    onLayout={handleLabelLayout}
                    style={[
                      styles.text,
                      styles.labelMeasure,
                      {
                        fontSize: config.fontSize,
                      },
                      textStyle,
                    ]}
                  >
                    {measureLabel}
                  </Text>
                )}
              </View>
            )}

            {badge && !iconOnly && (
              <Text
                style={[
                  styles.badge,
                  {
                    backgroundColor: `${contentColor}24`,
                    color: contentColor,
                  },
                ]}
              >
                {badge}
              </Text>
            )}

            {shortcut && !iconOnly && (
              <Text
                style={[
                  styles.shortcut,
                  {
                    color: contentColor,
                  },
                ]}
              >
                {shortcut}
              </Text>
            )}

            {!loading && iconEnd && renderIcon(iconEnd, contentColor)}
          </>
        );
      }}
    </Pressable>
  );
}
