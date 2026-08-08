import { useMemo } from 'react';

import type { ReactNode } from 'react';

import type { ParsedNativeDropdownChildren } from '../../../components/Dropdown/internal/types';

type UseDropdownEntriesParams = {
  parsed: ParsedNativeDropdownChildren;
  filteredParsed: ParsedNativeDropdownChildren;
  loading: boolean;
  loadingText: ReactNode;
  isSearchable: boolean;
  empty?: ReactNode;
};

export const useDropdownEntries = ({
  parsed,
  filteredParsed,
  loading,
  loadingText,
  isSearchable,
  empty,
}: UseDropdownEntriesParams) => {
  const navigableItems = useMemo(
    () =>
      parsed.items.map((item) => ({
        disabled: item.disabled,
        label: item.label,
        value: item.id,
      })),
    [parsed.items]
  );

  const data = useMemo(() => {
    if (loading) {
      return [
        {
          type: 'loading' as const,
          id: 'loading',
          props: { children: loadingText },
        },
      ];
    }

    if (isSearchable && filteredParsed.items.length === 0) {
      return [
        {
          type: 'empty' as const,
          id: 'empty',
          props: { children: empty ?? 'No actions found' },
        },
      ];
    }

    return filteredParsed.entries;
  }, [
    empty,
    filteredParsed.entries,
    filteredParsed.items.length,
    isSearchable,
    loading,
    loadingText,
  ]);

  return {
    navigableItems,
    data,
  };
};
