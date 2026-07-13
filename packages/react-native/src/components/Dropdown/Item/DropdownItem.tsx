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
  const contentColor = disabled
    ? theme.components.dropdown.item.disabled.fg
    : danger
      ? theme.components.dropdown.item.danger.default.fg
      : theme.components.dropdown.item.default.fg;

  const renderColoredNode = (node: ReactNode, color: string) => {
    if (!isValidElement(node)) return node;

    return cloneElement(node as ReactElement<{ color?: string }>, { color });
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
      {icon ? renderColoredNode(icon, contentColor) : null}

      <Text
        numberOfLines={textWrap === 'wrap' ? undefined : 1}
        style={[
          styles.itemText,
          danger && styles.dangerText,
          disabled && styles.itemTextDisabled,
          textStyle,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

DropdownItem.displayName = 'DropdownItem';
