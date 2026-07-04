import { Portal } from '@utils/Portal';

import { SelectOption } from '../SelectOption/SelectOption';

import type { SelectDropdownProps } from './types';

import styles from './SelectDropdown.module.scss';

export const SelectDropdown = ({
  isOpen,
  listboxId,
  labelledById,
  setDropdownRef,
  style,
  options,
  selectedValue,
  activeIndex,
  onSelect,
  onMouseEnter,
}: SelectDropdownProps) => {
  if (!isOpen) return null;

  return (
    <Portal>
      <ul
        ref={setDropdownRef}
        id={listboxId}
        role='listbox'
        aria-labelledby={labelledById}
        className={styles.dropdown}
        style={style}
      >
        {options.map((option, index) => (
          <SelectOption
            key={option.value}
            option={option}
            isSelected={option.value === selectedValue}
            isActive={index === activeIndex}
            optionId={`${listboxId}-option-${index}`}
            onSelect={onSelect}
            onMouseEnter={() => onMouseEnter(index)}
          />
        ))}
      </ul>
    </Portal>
  );
};

SelectDropdown.displayName = 'SelectDropdown';
