import { useMemo } from 'react';

import type { ReactNode } from 'react';

import type { SelectOption, SelectProps } from '../types';

type UseSelectRootDisplayValueParams = {
  multiple: boolean;
  placeholder: string;
  renderValue: SelectProps['renderValue'];
  selectedOption: SelectOption | undefined;
  selectedOptions: SelectOption[];
  selectedValues: string[];
};

export function useSelectRootDisplayValue({
  multiple,
  placeholder,
  renderValue,
  selectedOption,
  selectedOptions,
  selectedValues,
}: UseSelectRootDisplayValueParams) {
  return useMemo<ReactNode>(() => {
    if (renderValue) {
      return renderValue({
        option: selectedOption,
        options: selectedOptions,
        value: selectedValues[0] ?? '',
        values: selectedValues,
        placeholder,
        multiple,
      });
    }

    if (multiple && selectedOptions.length > 0) {
      const visibleLabels = selectedOptions
        .slice(0, 2)
        .map((option) => option.label);

      return selectedOptions.length > 2
        ? `${visibleLabels.join(', ')} +${selectedOptions.length - 2}`
        : visibleLabels.join(', ');
    }

    return selectedOption?.label ?? placeholder;
  }, [
    multiple,
    placeholder,
    renderValue,
    selectedOption,
    selectedOptions,
    selectedValues,
  ]);
}
