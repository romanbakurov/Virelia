import { useCallback, useMemo, useState } from 'react';

import { filterDropdownEntries } from '../../../components/Dropdown/internal/DropdownUtils';
import type { ParsedNativeDropdownChildren } from '../../../components/Dropdown/internal/types';

type UseDropdownSearchParams = {
  parsed: ParsedNativeDropdownChildren;
  searchable: boolean;
  command: boolean;
  searchValue?: string;
  defaultSearchValue: string;
  onSearch?: (value: string) => void;
};

export const useDropdownSearch = ({
  parsed,
  searchable,
  command,
  searchValue,
  defaultSearchValue,
  onSearch,
}: UseDropdownSearchParams) => {
  const [uncontrolledSearchValue, setUncontrolledSearchValue] =
    useState(defaultSearchValue);

  const resolvedSearchValue = searchValue ?? uncontrolledSearchValue;
  const contentCommand = parsed.contentProps?.command ?? false;

  const isSearchable =
    searchable || command || contentCommand || Boolean(parsed.searchProps);

  const filteredParsed = useMemo(() => {
    if (!isSearchable || !resolvedSearchValue.trim()) {
      return parsed;
    }

    return filterDropdownEntries(parsed, resolvedSearchValue);
  }, [isSearchable, parsed, resolvedSearchValue]);

  const handleSearchChange = useCallback(
    (value: string) => {
      if (searchValue === undefined) {
        setUncontrolledSearchValue(value);
      }

      onSearch?.(value);
    },
    [onSearch, searchValue]
  );

  return {
    contentCommand,
    filteredParsed,
    handleSearchChange,
    isSearchable,
    resolvedSearchValue,
  };
};
