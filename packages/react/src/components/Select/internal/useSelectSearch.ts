import { useMemo } from 'react';

import type { SelectOption } from '../types';

interface UseSelectSearchParams {
  options: SelectOption[];
  searchable: boolean;
  searchValue: string;
}

export function useSelectSearch({
  options,
  searchable,
  searchValue,
}: UseSelectSearchParams) {
  return useMemo(() => {
    if (!searchable || !searchValue) return options;

    const normalizedSearch = searchValue.toLocaleLowerCase();

    return options.filter((option) =>
      `${option.label} ${getSearchableText(option.description)}`
        .toLocaleLowerCase()
        .includes(normalizedSearch)
    );
  }, [options, searchValue, searchable]);
}

function getSearchableText(value: unknown) {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  return '';
}
