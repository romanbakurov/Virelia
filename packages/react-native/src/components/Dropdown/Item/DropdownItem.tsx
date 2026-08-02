import { cloneElement, isValidElement } from 'react';

import type { ReactElement, ReactNode } from 'react';
import { Pressable, Text } from 'react-native';

import { useTheme, useThemeStyles } from '../../../theme';

import { createStyles } from './DropdownItem.styles';
import type { DropdownItemProps } from './types';

export function DropdownItem({
  label,
  value,
  rootColor = 'primary',
  color = 'default',
  icon,
  disabled = false,
  textWrap = 'truncate',
  itemStyle,
  textStyle,
  onSelect,
}: DropdownItemProps) {
  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles);
  const rootColorPalette = theme.components.dropdown[rootColor];
  const itemColorPalette =
    color === 'default' ? undefined : theme.components.dropdown[color];

  const renderColoredNode = (node: ReactNode, color: string) => {
    if (!isValidElement(node)) return node;

    return cloneElement(node as ReactElement<{ color?: string }>, { color });
  };

  const getContentColor = (pressed: boolean) => {
    if (disabled) {
      return theme.components.dropdown.item.disabled.fg;
    }

    if (color === 'danger') {
      return pressed
        ? theme.components.dropdown.item.danger.active.fg
        : theme.components.dropdown.item.danger.default.fg;
    }

    if (itemColorPalette) {
      return pressed
        ? itemColorPalette.item.pressed.fg
        : itemColorPalette.item.fg;
    }

    return pressed
      ? rootColorPalette.item.pressed.fg
      : theme.components.dropdown.item.default.fg;
  };

  const getBackgroundColor = (pressed: boolean) => {
    if (disabled) {
      return theme.components.dropdown.item.disabled.bg;
    }

    if (color === 'danger') {
      return pressed
        ? theme.components.dropdown.item.danger.active.bg
        : theme.components.dropdown.item.danger.default.bg;
    }

    if (itemColorPalette) {
      return pressed
        ? itemColorPalette.item.pressed.bg
        : theme.components.dropdown.item.default.bg;
    }

    return pressed
      ? rootColorPalette.item.pressed.bg
      : theme.components.dropdown.item.default.bg;
  };

  const accessibilityLabel = typeof label === 'string' ? label : value;
  const numberOfLines = textWrap === 'wrap' ? undefined : 1;
  const ellipsizeMode = textWrap === 'truncate' ? 'tail' : 'clip';

  return (
    <Pressable
      disabled={disabled}
      accessibilityRole='menuitem'
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      onPress={() => {
        if (disabled) return;

        onSelect(value);
      }}
      style={({ pressed }) => [
        styles.item,
        {
          backgroundColor: getBackgroundColor(pressed),
        },
        itemStyle,
      ]}
    >
      {({ pressed }) => {
        const contentColor = getContentColor(pressed);

        return (
          <>
            {icon ? renderColoredNode(icon, contentColor) : null}

            <Text
              numberOfLines={numberOfLines}
              ellipsizeMode={ellipsizeMode}
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
