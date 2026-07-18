import { useEffect, useState } from 'react';

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
  entries,
  multiple,
  selectedValues,
  searchable,
  command,
  virtual,
  portal = true,
  searchValue = '',
  searchPlaceholder = 'Search...',
  loading,
  loadingText = 'Loading...',
  noOptionsText,
  searchSlot,
  headerSlot,
  emptySlot,
  loadingSlot,
  renderOption,
  selectedValue,
  activeIndex,
  className,
  onSelect,
  onMouseEnter,
  onSearchChange,
}: SelectDropdownProps) => {
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setScrollTop(0);
    }
  }, [isOpen, searchValue]);

  if (!isOpen) return null;

  const virtualConfig =
    typeof virtual === 'object' ? virtual : virtual ? {} : undefined;
  const itemHeight = virtualConfig?.itemHeight ?? 40;
  const viewportHeight = 300;
  const isVirtual = Boolean(virtualConfig && options.length > 0 && !loading);
  const startIndex = isVirtual
    ? Math.max(0, Math.floor(scrollTop / itemHeight) - 2)
    : 0;
  const visibleCount = isVirtual
    ? Math.ceil(viewportHeight / itemHeight) + 4
    : options.length;
  const visibleOptions = isVirtual
    ? options.slice(startIndex, startIndex + visibleCount)
    : options;
  const visibleEntries =
    entries && !isVirtual
      ? entries
      : visibleOptions.map((option, visibleIndex) => ({
          type: 'option' as const,
          option,
          optionIndex: startIndex + visibleIndex,
        }));
  const topSpacerHeight = isVirtual ? startIndex * itemHeight : 0;
  const bottomSpacerHeight = isVirtual
    ? Math.max(
        0,
        (options.length - startIndex - visibleOptions.length) * itemHeight
      )
    : 0;

  const dropdown = (
    <div
      ref={setDropdownRef}
      className={[
        styles.dropdown,
        command ? styles.command : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      onScroll={(event) => {
        if (!isVirtual) return;

        setScrollTop(event.currentTarget.scrollTop);
      }}
    >
      {headerSlot}

      {searchSlot ??
        (searchable && (
          <div className={styles.searchWrap}>
            <input
              className={styles.search}
              value={searchValue}
              placeholder={command ? 'Type a command...' : searchPlaceholder}
              aria-label='Search options'
              onInput={(event) => onSearchChange?.(event.currentTarget.value)}
              onChange={(event) => onSearchChange?.(event.target.value)}
            />
          </div>
        ))}

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
            {loadingSlot ?? loadingText}
          </li>
        ) : options.length ? (
          <>
            {isVirtual && (
              <li
                aria-hidden='true'
                className={styles.virtualSpacer}
                style={{ height: topSpacerHeight }}
              />
            )}
            {visibleEntries.map((entry) => {
              if (entry.type === 'group') {
                return (
                  <li
                    key={entry.id}
                    role='presentation'
                    className={styles.groupLabel}
                  >
                    {entry.label}
                  </li>
                );
              }

              if (entry.type === 'separator') {
                return (
                  <li
                    key={entry.id}
                    role='separator'
                    className={styles.separator}
                  />
                );
              }

              const { option, optionIndex } = entry;

              return (
                <SelectOption
                  key={option.value}
                  option={option}
                  isSelected={
                    selectedValues
                      ? selectedValues.includes(option.value)
                      : option.value === selectedValue
                  }
                  isActive={optionIndex === activeIndex}
                  optionId={`${listboxId}-option-${optionIndex}`}
                  renderOption={renderOption}
                  onSelect={onSelect}
                  onMouseEnter={() => onMouseEnter(optionIndex)}
                />
              );
            })}
            {isVirtual && (
              <li
                aria-hidden='true'
                className={styles.virtualSpacer}
                style={{ height: bottomSpacerHeight }}
              />
            )}
          </>
        ) : (
          <li
            role='option'
            aria-disabled='true'
            aria-selected='false'
            className={styles.empty}
          >
            {emptySlot ?? noOptionsText}
          </li>
        )}
      </ul>
    </div>
  );

  return portal ? <Portal>{dropdown}</Portal> : dropdown;
};

SelectDropdown.displayName = 'SelectDropdown';
