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
  multiple,
  selectedValues,
  searchable,
  portal = true,
  searchValue = '',
  searchPlaceholder = 'Search...',
  loading,
  loadingText = 'Loading...',
  noOptionsText,
  renderOption,
  selectedValue,
  activeIndex,
  className,
  onSelect,
  onMouseEnter,
  onSearchChange,
}: SelectDropdownProps) => {
  if (!isOpen) return null;

  const dropdown = (
    <div
      ref={setDropdownRef}
      className={[styles.dropdown, className].filter(Boolean).join(' ')}
      style={style}
    >
      {searchable && (
        <div className={styles.searchWrap}>
          <input
            className={styles.search}
            value={searchValue}
            placeholder={searchPlaceholder}
            aria-label='Search options'
            onInput={(event) => onSearchChange?.(event.currentTarget.value)}
            onChange={(event) => onSearchChange?.(event.target.value)}
          />
        </div>
      )}

      <ul
        id={listboxId}
        role='listbox'
        aria-multiselectable={multiple || undefined}
        aria-labelledby={labelledById}
        className={className}
      >
        {loading ? (
          <li
            role='option'
            aria-disabled='true'
            aria-selected='false'
            className={styles.empty}
          >
            {loadingText}
          </li>
        ) : options.length ? (
          options.map((option, index) => (
            <SelectOption
              key={option.value}
              option={option}
              isSelected={
                selectedValues
                  ? selectedValues.includes(option.value)
                  : option.value === selectedValue
              }
              isActive={index === activeIndex}
              optionId={`${listboxId}-option-${index}`}
              renderOption={renderOption}
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
    </div>
  );

  return portal ? <Portal>{dropdown}</Portal> : dropdown;
};

SelectDropdown.displayName = 'SelectDropdown';
