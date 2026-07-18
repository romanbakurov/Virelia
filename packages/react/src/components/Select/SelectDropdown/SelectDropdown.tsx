import { useCallback, useEffect, useRef, useState } from 'react';

import { Portal } from '@utils/Portal';
import { Close } from '@vellira-ui/icons';

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
  color = 'primary',
  variant = 'outline',
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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [dropdownNode, setDropdownNode] = useState<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const virtualConfig =
    typeof virtual === 'object' ? virtual : virtual ? {} : undefined;
  const itemHeight = virtualConfig?.itemHeight ?? 40;
  const viewportHeight = 300;
  const isVirtual = Boolean(virtualConfig && options.length > 0 && !loading);

  const handleDropdownRef = useCallback(
    (node: HTMLDivElement | null) => {
      setDropdownNode(node);
      setDropdownRef(node);
    },
    [setDropdownRef]
  );

  useEffect(() => {
    if (!isOpen) {
      setScrollTop(0);
    }
  }, [isOpen, searchValue]);

  useEffect(() => {
    if (!isOpen || loading || !dropdownNode) return;

    const selectedIndex = options.findIndex((option) =>
      selectedValues
        ? selectedValues.includes(option.value)
        : option.value === selectedValue
    );
    const targetIndex = selectedIndex >= 0 ? selectedIndex : activeIndex;

    if (targetIndex < 0) return;

    if (isVirtual) {
      const nextScrollTop = Math.max(
        0,
        targetIndex * itemHeight - (viewportHeight - itemHeight) / 2
      );

      setScrollTop(nextScrollTop);

      dropdownNode.scrollTop = nextScrollTop;

      return;
    }

    const selectedElement = document.getElementById(
      `${listboxId}-option-${targetIndex}`
    );

    selectedElement?.scrollIntoView?.({ block: 'nearest' });
  }, [
    activeIndex,
    dropdownNode,
    isOpen,
    isVirtual,
    itemHeight,
    listboxId,
    loading,
    options,
    selectedValue,
    selectedValues,
  ]);

  if (!isOpen) return null;

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
      ref={handleDropdownRef}
      tabIndex={0}
      className={[
        styles.dropdown,
        styles[color],
        styles[variant],
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
              ref={searchInputRef}
              className={styles.search}
              value={searchValue}
              placeholder={command ? 'Type a command...' : searchPlaceholder}
              aria-label='Search options'
              onInput={(event) => onSearchChange?.(event.currentTarget.value)}
              onChange={(event) => onSearchChange?.(event.target.value)}
            />
            {searchValue && (
              <button
                type='button'
                className={styles.searchClear}
                aria-label='Clear search'
                onClick={() => {
                  onSearchChange?.('');
                  searchInputRef.current?.focus();
                }}
              >
                <Close />
              </button>
            )}
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
                    role='presentation'
                    aria-hidden='true'
                    className={styles.separator}
                    data-vellira-select-separator='true'
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
