import { useState } from 'react';

import { View } from 'react-native';

import { useThemeStyles } from '../../theme';

import { DropdownContent } from './Content/DropdownContent';
import { DropdownGroup } from './Group/DropdownGroup';
import { DropdownItem } from './Item/DropdownItem';
import { DropdownSeparator } from './Separator/DropdownSeparator';
import { DropdownTrigger } from './Trigger/DropdownTrigger';
import { createStyles } from './Dropdown.styles';
import type { DropdownProps } from './types';
import { isGroup, isSeparator } from './types';

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
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = open ?? uncontrolledOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(next);
    }

    onOpenChange?.(next);
  };

  const close = () => {
    if (!isOpen) return;

    setOpen(false);
  };

  const handleSelect = (value: string) => {
    onSelect?.(value);
    close();
  };

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
        onPress={() => {
          if (disabled) return;

          setOpen(!isOpen);
        }}
      />

      <DropdownContent
        isOpen={isOpen}
        onClose={close}
        contentStyle={contentStyle}
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

          return (
            <DropdownItem
              key={item.value}
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
