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
  disabled = false,
  style,
  triggerStyle,
  itemStyle,
  textStyle,
}: DropdownProps) {
  const styles = useThemeStyles(createStyles);
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

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
        onPress={() => {
          if (disabled) return;

          setIsOpen(true);
        }}
      />

      <DropdownContent isOpen={isOpen} onClose={close}>
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
