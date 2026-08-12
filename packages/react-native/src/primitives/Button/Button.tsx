import { cloneElement, useState } from 'react';

import { controlSizes } from '@vellira-ui/tokens';
import type { LayoutChangeEvent, PressableProps } from 'react-native';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { useTheme, useThemeStyles } from '../../theme';
import { devWarning } from '../../utils/devWarning';

import { createStyles } from './Button.styles';
import type { ButtonIconElement, ButtonProps } from './types';

const buttonSizeMap: Record<
  NonNullable<ButtonProps['size']>,
  {
    px: number;
  }
> = {
  sm: {
    px: 16,
  },
  md: {
    px: 24,
  },
  lg: {
    px: 32,
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
  const controlSize = controlSizes[size];
  const buttonSize = buttonSizeMap[size];
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

  const resolvedIconSize = iconSize ?? controlSize.iconSize;

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
            minHeight: controlSize.height,
            paddingHorizontal: iconOnly ? 0 : buttonSize.px,
            paddingVertical: 0,
            width: iconOnly ? controlSize.height : undefined,
            height: iconOnly ? controlSize.height : undefined,
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
            {loading && (
              <ActivityIndicator
                size={controlSize.iconSize}
                color={contentColor}
              />
            )}

            {!loading && iconStart && renderIcon(iconStart, contentColor)}

            {content && !iconOnly && (
              <View
                style={[
                  styles.labelSlot,
                  labelWidth > 0 && { minWidth: labelWidth },
                ]}
              >
                <Text
                  onLayout={handleLabelLayout}
                  style={[
                    styles.text,
                    {
                      fontSize: controlSize.fontSize,
                      lineHeight: controlSize.lineHeight,
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
                        fontSize: controlSize.fontSize,
                        lineHeight: controlSize.lineHeight,
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
