import { useCallback, useMemo } from 'react';

import { useDropdown } from '@vellira-ui/core';
import { View } from 'react-native';

import { useThemeStyles } from '../../theme';

import { DropdownContent } from './Content/DropdownContent';
import { DropdownGroup } from './Group/DropdownGroup';
import { DropdownItem } from './Item/DropdownItem';
import { DropdownSeparator } from './Separator/DropdownSeparator';
import { DropdownTrigger } from './Trigger/DropdownTrigger';
import { createStyles } from './Dropdown.styles';
import type { DropdownProps } from './types';
import { isGroup, isMenuItem, isSeparator } from './types';

export function Dropdown({
  label = 'Menu',
  trigger,
  icon,
  arrowIcon,
  showArrow = true,
  items,
  onSelect,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  style,
  triggerStyle,
  contentStyle,
  itemStyle,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
}: DropdownProps) {
  const styles = useThemeStyles(createStyles);
  const menuAccessibilityLabel = useMemo(() => {
    if (accessibilityLabel) return accessibilityLabel;

    return typeof label === 'string' ? label : 'Menu';
  }, [accessibilityLabel, label]);

  const navigableItems = useMemo(
    () => items.filter((item) => isMenuItem(item)),
    [items]
  );

  const { isOpen, closeDropdown, toggleDropdown } = useDropdown({
    items: navigableItems,
    open,
    defaultOpen,
    disabled,
    onOpenChange,
    onSelect,
    getItemValue: (item) => item.value,
    getItemText: (item) =>
      typeof item.label === 'string' ? item.label : item.value,
  });

  const handleSelect = useCallback(
    (value: string) => {
      onSelect?.(value);
      closeDropdown();
    },
    [closeDropdown, onSelect]
  );

  const handleTriggerPress = useCallback(() => {
    toggleDropdown();
  }, [toggleDropdown]);

  return (
    <View style={[styles.root, style]}>
      <DropdownTrigger
        label={label}
        trigger={trigger}
        icon={icon}
        arrowIcon={arrowIcon}
        showArrow={showArrow}
        disabled={disabled}
        isOpen={isOpen}
        triggerStyle={triggerStyle}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        onPress={handleTriggerPress}
      />

      <DropdownContent
        isOpen={isOpen}
        onClose={closeDropdown}
        contentStyle={contentStyle}
        accessibilityLabel={menuAccessibilityLabel}
      >
        {items.map((item, index) => {
          if (isGroup(item)) {
            return (
              <DropdownGroup
                key={`group-${item.label}-${index}`}
                label={item.label}
              />
            );
          }

          if (isSeparator(item)) {
            return <DropdownSeparator key={`separator-${index}`} />;
          }

          if (!isMenuItem(item)) {
            return null;
          }

          return (
            <DropdownItem
              key={`${item.value}-${index}`}
              label={item.label}
              value={item.value}
              icon={item.icon}
              danger={item.danger}
              disabled={item.disabled}
              textWrap={item.textWrap}
              itemStyle={itemStyle}
              textStyle={textStyle}
              onSelect={handleSelect}
            />
          );
        })}
      </DropdownContent>
    </View>
  );
}

Dropdown.displayName = 'Dropdown';
