export type ResolveSelectGroupSelectionParams = {
  selectedValues: readonly string[];
  groupValues: readonly string[];
  enabledValues: ReadonlySet<string>;
  maxSelected?: number;
};

export type ResolveSelectGroupSelectionResult = {
  selectedValues: string[];
  clearedGroup: boolean;
  addedValue?: string;
};

export function resolveSelectGroupSelection({
  selectedValues,
  groupValues,
  enabledValues,
  maxSelected,
}: ResolveSelectGroupSelectionParams): ResolveSelectGroupSelectionResult {
  const selectableGroupValues = groupValues.filter((value) =>
    enabledValues.has(value)
  );

  if (selectableGroupValues.length === 0) {
    return {
      selectedValues: [...selectedValues],
      clearedGroup: false,
    };
  }

  const selectedGroupValues = selectableGroupValues.filter((value) =>
    selectedValues.includes(value)
  );
  const outsideSelectedCount = selectedValues.filter(
    (value) => !selectableGroupValues.includes(value)
  ).length;
  const maxSelectableGroupCount =
    typeof maxSelected === 'number'
      ? Math.max(
          0,
          Math.min(
            selectableGroupValues.length,
            maxSelected - outsideSelectedCount
          )
        )
      : selectableGroupValues.length;
  const shouldClearGroup =
    selectedGroupValues.length > 0 &&
    selectedGroupValues.length >= maxSelectableGroupCount;

  if (shouldClearGroup) {
    return {
      selectedValues: selectedValues.filter(
        (value) => !selectableGroupValues.includes(value)
      ),
      clearedGroup: true,
    };
  }

  const nextValues = [...selectedValues];
  let addedValue: string | undefined;

  for (const value of selectableGroupValues) {
    if (nextValues.includes(value)) continue;

    if (typeof maxSelected === 'number' && nextValues.length >= maxSelected) {
      break;
    }

    nextValues.push(value);
    addedValue = value;
  }

  return {
    selectedValues: nextValues,
    clearedGroup: false,
    addedValue,
  };
}
