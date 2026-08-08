export interface SelectSearchOption {
  label: string;
  description?: unknown;
}

interface FilterSelectOptionsParams<TOption extends SelectSearchOption> {
  options: TOption[];
  searchable: boolean;
  searchValue: string;
}

export function filterSelectOptions<TOption extends SelectSearchOption>({
  options,
  searchable,
  searchValue,
}: FilterSelectOptionsParams<TOption>) {
  if (!searchable || !searchValue) return options;

  const normalizedSearch = searchValue.toLocaleLowerCase();

  return options.filter((option) =>
    `${option.label} ${getSearchableText(option.description)}`
      .toLocaleLowerCase()
      .includes(normalizedSearch)
  );
}

function getSearchableText(value: unknown) {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }

  return '';
}
