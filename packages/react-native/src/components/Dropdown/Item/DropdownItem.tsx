import { cloneElement, isValidElement } from 'react';

import type { ReactElement, ReactNode } from 'react';
import { Pressable, Text } from 'react-native';

import { useTheme, useThemeStyles } from '../../../theme';

import { createStyles } from './DropdownItem.styles';
import type { DropdownItemProps } from './types';

export function DropdownItem({
  label,
  value,
  icon,
  danger = false,
  disabled = false,
  textWrap = 'truncate',
  itemStyle,
  textStyle,
  onSelect,
}: DropdownItemProps) {
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles);

  const renderColoredNode = (node: ReactNode, color: string) => {
    if (!isValidElement(node)) return node;

    return cloneElement(node as ReactElement<{ color?: string }>, { color });
  };

  const getContentColor = (pressed: boolean) => {
    if (disabled) return theme.components.dropdown.item.disabled.fg;

    if (danger) {
      return pressed
        ? theme.components.dropdown.item.danger.hover.fg
        : theme.components.dropdown.item.danger.default.fg;
    }

    return pressed
      ? theme.components.dropdown.item.hover.fg
      : theme.components.dropdown.item.default.fg;
  };

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole='menuitem'
      accessibilityLabel={typeof label === 'string' ? label : undefined}
      accessibilityState={{ disabled }}
      onPress={() => {
        if (disabled) return;

        onSelect(value);
      }}
      style={({ pressed }) => [
        styles.item,
        pressed && styles.itemPressed,
        disabled && styles.itemDisabled,
        pressed && danger && !disabled && styles.itemDangerPressed,
        itemStyle,
      ]}
    >
      {({ pressed }) => {
        const contentColor = getContentColor(pressed);

        return (
          <>
            {icon ? renderColoredNode(icon, contentColor) : null}

            <Text
              numberOfLines={textWrap === 'wrap' ? undefined : 1}
              style={[styles.itemText, { color: contentColor }, textStyle]}
            >
              {label}
            </Text>
          </>
        );
      }}
    </Pressable>
  );
}

DropdownItem.displayName = 'DropdownItem';
