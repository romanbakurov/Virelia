import { useEffect, useMemo, useState } from 'react';

import type { SelectOption } from '../types';

import { defaultSelectFilter } from './SelectCollection';
import type { SelectCollectionRow } from './types';

type UseSelectSearchParams = {
  rows: SelectCollectionRow[];
  isOpen: boolean;
  searchable?: boolean;
  searchableFromChildren: boolean;
  onSearch?: (query: string) => void;
  filterOptions?: boolean;
  filter?: (option: SelectOption, query: string) => boolean;
};

export const useSelectSearch = ({
  rows,
  isOpen,
  searchable,
  searchableFromChildren,
  onSearch,
  filterOptions,
  filter = defaultSelectFilter,
}: UseSelectSearchParams) => {
  const [query, setQuery] = useState('');
  const shouldSearch =
    searchable ?? searchableFromChildren ?? Boolean(onSearch);
  const shouldFilter = filterOptions ?? !onSearch;

  const filteredRows = useMemo(() => {
    if (!query || !shouldFilter) return rows;

    const visibleRows: SelectCollectionRow[] = [];
    let pendingGroup: SelectCollectionRow | undefined;

    rows.forEach((row) => {
      if (row.type === 'group') {
        pendingGroup = row;
        return;
      }

      if (row.type === 'separator') {
        if (
          visibleRows.length > 0 &&
          visibleRows[visibleRows.length - 1]?.type !== 'separator'
        ) {
          visibleRows.push(row);
        }
        return;
      }

      if (!filter(row.option, query)) return;

      if (pendingGroup) {
        visibleRows.push(pendingGroup);
        pendingGroup = undefined;
      }

      visibleRows.push(row);
    });

    return visibleRows.filter((row, index, collection) => {
      if (row.type !== 'separator') return true;

      return (
        index > 0 &&
        index < collection.length - 1 &&
        collection[index - 1]?.type !== 'separator'
      );
    });
  }, [filter, query, rows, shouldFilter]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      return;
    }

    if (shouldSearch) {
      onSearch?.(query);
    }
  }, [isOpen, onSearch, query, shouldSearch]);

  return {
    query,
    setQuery,
    shouldSearch,
    filteredRows,
  };
};
