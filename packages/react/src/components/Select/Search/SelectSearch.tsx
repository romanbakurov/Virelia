import { useEffect, useRef } from 'react';

import { cn } from '@utils/cn';
import { Close } from '@vellira-ui/icons';

import { useSelectContext } from '../internal/SelectContext';
import { markSelectSlot, type SelectSlotComponent } from '../internal/types';

import styles from '../Content/SelectContent.module.scss';

export interface SelectSearchProps {
  /** Placeholder shown in the search input. */
  placeholder?: string;
  /** Class name applied to the search input. */
  className?: string;
}

export const SelectSearch: SelectSlotComponent<SelectSearchProps> = ({
  placeholder,
  className,
}) => {
  const { contentProps } = useSelectContext();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchValue = contentProps.searchValue ?? '';

  useEffect(() => {
    if (!contentProps.isOpen) return;

    const focusTimerId = window.setTimeout(() => {
      searchInputRef.current?.focus({ preventScroll: true });
    }, 0);

    return () => window.clearTimeout(focusTimerId);
  }, [contentProps.isOpen]);

  return (
    <div className={styles.searchWrap}>
      <input
        ref={searchInputRef}
        className={cn(styles.search, className)}
        value={searchValue}
        placeholder={
          placeholder ??
          (contentProps.command ? 'Type a command...' : 'Search...')
        }
        aria-label='Search options'
        onInput={(event) =>
          contentProps.onSearchChange?.(event.currentTarget.value)
        }
        onChange={(event) => contentProps.onSearchChange?.(event.target.value)}
      />
      {searchValue && (
        <button
          type='button'
          className={styles.searchClear}
          aria-label='Clear search'
          onClick={() => {
            contentProps.onSearchChange?.('');
            searchInputRef.current?.focus();
          }}
        >
          <Close />
        </button>
      )}
    </div>
  );
};

markSelectSlot(SelectSearch, 'search');
SelectSearch.displayName = 'Select.Search';
