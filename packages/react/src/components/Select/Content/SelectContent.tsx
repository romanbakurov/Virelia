import {
  Children,
  type CSSProperties,
  isValidElement,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Portal } from '@primitives/Portal';
import { Close } from '@vellira-ui/icons';

import { useSelectContext } from '../internal/SelectContext';
import { resolveSelectVirtualization } from '../internal/SelectVirtualization';
import {
  getSelectSlotPart,
  markSelectSlot,
  type SelectSlotComponent,
} from '../internal/types';
import { SelectItemRow } from '../Item/SelectItem';

import type { SelectContentProps } from './types';

import styles from './SelectContent.module.scss';

export interface SelectContentSlotProps {
  /** Custom dropdown content slots. */
  children?: ReactNode;
  /** Class name applied to the dropdown content. */
  className?: string;
}

export const SelectContent: SelectSlotComponent<SelectContentSlotProps> = ({
  children,
  className,
}) => {
  const { contentProps } = useSelectContext();
  const slots = collectSelectContentSlots(children);

  return (
    <SelectContentSurface
      {...contentProps}
      {...slots}
      className={[contentProps.className, className].filter(Boolean).join(' ')}
    />
  );
};

markSelectSlot(SelectContent, 'content');
SelectContent.displayName = 'Select.Content';

export const SelectContentSurface = ({
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
  emptyText,
  searchSlot,
  headerSlot,
  emptySlot,
  loadingSlot,
  renderOption,
  selectedValue,
  activeIndex,
  visualActiveIndex = activeIndex,
  className,
  onSelect,
  onSelectGroup,
  onMouseEnter,
  onSearchChange,
}: SelectContentProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const didPositionOnOpenRef = useRef(false);
  const [dropdownNode, setDropdownNode] = useState<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState<number>();
  const {
    bottomSpacerHeight,
    isVirtual,
    itemHeight,
    maxHeight,
    startIndex,
    topSpacerHeight,
    viewportHeight: resolvedViewportHeight,
    visibleOptions,
  } = useMemo(
    () =>
      resolveSelectVirtualization({
        loading,
        options,
        scrollTop,
        virtual,
        viewportHeight,
      }),
    [loading, options, scrollTop, viewportHeight, virtual]
  );

  const handleDropdownRef = useCallback(
    (node: HTMLDivElement | null) => {
      setDropdownNode(node);
      setDropdownRef(node);

      if (node) {
        setViewportHeight(node.clientHeight || undefined);
      }
    },
    [setDropdownRef]
  );

  useEffect(() => {
    if (!isOpen) {
      didPositionOnOpenRef.current = false;
      setScrollTop(0);
      setViewportHeight(undefined);
    }
  }, [isOpen, searchValue]);

  useEffect(() => {
    if (!isOpen || !dropdownNode) return;

    setViewportHeight(dropdownNode.clientHeight || undefined);

    if (!('ResizeObserver' in window)) return;

    const observer = new ResizeObserver(([entry]) => {
      setViewportHeight(entry?.contentRect.height || undefined);
    });

    observer.observe(dropdownNode);

    return () => observer.disconnect();
  }, [dropdownNode, isOpen]);

  useEffect(() => {
    if (!isOpen || !searchable) return;

    const focusTimerId = window.setTimeout(() => {
      searchInputRef.current?.focus({ preventScroll: true });
    }, 0);

    return () => window.clearTimeout(focusTimerId);
  }, [isOpen, searchable]);

  useEffect(() => {
    if (!isOpen || loading || !dropdownNode || didPositionOnOpenRef.current) {
      return;
    }

    const selectedIndex = options.findIndex((option) =>
      selectedValues
        ? selectedValues.includes(option.value)
        : option.value === selectedValue
    );
    const targetIndex = selectedIndex >= 0 ? selectedIndex : activeIndex;

    if (targetIndex < 0) {
      didPositionOnOpenRef.current = true;
      return;
    }

    didPositionOnOpenRef.current = true;

    if (isVirtual) {
      const nextScrollTop = Math.max(
        0,
        targetIndex * itemHeight - (resolvedViewportHeight - itemHeight) / 2
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
    resolvedViewportHeight,
  ]);

  const dropdownStyle = useMemo(
    () =>
      ({
        ...style,
        '--select-dropdown-max-height':
          typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
      }) as CSSProperties,
    [maxHeight, style]
  );

  if (!isOpen) return null;

  const visibleEntries =
    entries && !isVirtual
      ? entries
      : visibleOptions.map((option, visibleIndex) => ({
          type: 'option' as const,
          option,
          optionIndex: startIndex + visibleIndex,
        }));

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
      style={dropdownStyle}
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
                if (entry.selectable && multiple) {
                  const enabledGroupValues = entry.itemValues.filter((value) =>
                    options.some(
                      (option) => option.value === value && !option.disabled
                    )
                  );
                  const selectedGroupCount = selectedValues
                    ? enabledGroupValues.filter((value) =>
                        selectedValues.includes(value)
                      ).length
                    : 0;
                  const isSelected =
                    enabledGroupValues.length > 0 &&
                    selectedGroupCount === enabledGroupValues.length;
                  const isMixed =
                    selectedGroupCount > 0 &&
                    selectedGroupCount < enabledGroupValues.length;

                  return (
                    <li key={entry.id} role='presentation'>
                      <button
                        type='button'
                        className={styles.groupAction}
                        aria-label={getTextLabel(
                          entry.selectLabel ?? entry.label
                        )}
                        aria-pressed={
                          isMixed ? 'mixed' : isSelected ? 'true' : 'false'
                        }
                        disabled={enabledGroupValues.length === 0}
                        onClick={() => onSelectGroup(enabledGroupValues)}
                      >
                        <span className={styles.groupActionText}>
                          {entry.selectLabel ?? entry.label}
                        </span>
                        <span className={styles.groupActionMeta}>
                          {selectedGroupCount}/{enabledGroupValues.length}
                        </span>
                      </button>
                    </li>
                  );
                }

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
                <SelectItemRow
                  key={option.value}
                  option={option}
                  isSelected={
                    selectedValues
                      ? selectedValues.includes(option.value)
                      : option.value === selectedValue
                  }
                  isActive={optionIndex === visualActiveIndex}
                  optionId={`${listboxId}-option-${optionIndex}`}
                  optionIndex={optionIndex}
                  selectedValues={selectedValues ?? []}
                  multiple={Boolean(multiple)}
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
            {emptySlot ?? emptyText}
          </li>
        )}
      </ul>
    </div>
  );

  return portal ? <Portal>{dropdown}</Portal> : dropdown;
};

SelectContentSurface.displayName = 'SelectContentSurface';

function collectSelectContentSlots(children: ReactNode) {
  let headerSlot: ReactNode;
  let searchSlot: ReactNode;
  let emptySlot: ReactNode;
  let loadingSlot: ReactNode;

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    const part = getSelectSlotPart(child.type);

    if (part === 'label') {
      headerSlot = child;
    }

    if (part === 'search') {
      searchSlot = child;
    }

    if (part === 'empty') {
      emptySlot = child;
    }

    if (part === 'loading') {
      loadingSlot = child;
    }
  });

  return { emptySlot, headerSlot, loadingSlot, searchSlot };
}

function getTextLabel(value: ReactNode) {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  return 'Select group';
}
