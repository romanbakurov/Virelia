import { useEffect, useRef } from 'react';

import { cn } from '@utils/cn';
import { Close } from '@vellira-ui/icons';

import { useSelectContext } from '../internal/SelectContext';
import type { SelectSlotComponent } from '../internal/types';

import styles from './SelectContent.module.scss';

export interface SelectSearchProps {
  placeholder?: string;
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

SelectSearch.__velliraSelectPart = 'search';
SelectSearch.displayName = 'Select.Search';
