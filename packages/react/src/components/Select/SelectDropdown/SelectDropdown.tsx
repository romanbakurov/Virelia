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
  noOptionsText,
  selectedValue,
  activeIndex,
  className,
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
        className={[styles.dropdown, className].filter(Boolean).join(' ')}
        style={style}
      >
        {options.length ? (
          options.map((option, index) => (
            <SelectOption
              key={option.value}
              option={option}
              isSelected={option.value === selectedValue}
              isActive={index === activeIndex}
              optionId={`${listboxId}-option-${index}`}
              onSelect={onSelect}
              onMouseEnter={() => onMouseEnter(index)}
            />
          ))
        ) : (
          <li
            role='option'
            aria-disabled='true'
            aria-selected='false'
            className={styles.empty}
          >
            {noOptionsText}
          </li>
        )}
      </ul>
    </Portal>
  );
};

SelectDropdown.displayName = 'SelectDropdown';
