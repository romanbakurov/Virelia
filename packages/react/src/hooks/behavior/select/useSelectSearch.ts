import { useMemo } from 'react';

interface SelectSearchOption {
  label: string;
  description?: unknown;
}

interface UseSelectSearchParams<TOption extends SelectSearchOption> {
  options: TOption[];
  searchable: boolean;
  searchValue: string;
}

export function useSelectSearch<TOption extends SelectSearchOption>({
  options,
  searchable,
  searchValue,
}: UseSelectSearchParams<TOption>) {
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
