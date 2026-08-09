import { useMemo } from 'react';

import { useSelect } from '../../../hooks';
import type { SelectOption, SelectProps } from '../types';

type UseSelectRootSelectionParams = {
  props: SelectProps;
  options: SelectOption[];
  isDisabled: boolean;
};

export function useSelectRootSelection({
  props,
  options,
  isDisabled,
}: UseSelectRootSelectionParams) {
  const controlledValue = props.multiple
    ? props.value
    : props.value === null
      ? ''
      : props.value;

  const controlledDefaultValue = props.multiple
    ? props.defaultValue
    : props.defaultValue === null
      ? ''
      : props.defaultValue;

  const selection = useSelect<SelectOption>({
    value: controlledValue,
    defaultValue: controlledDefaultValue,
    onValueChange: (nextValue: string | string[]) => {
      if (props.multiple) {
        props.onValueChange?.(
          Array.isArray(nextValue) ? nextValue : nextValue ? [nextValue] : []
        );
        return;
      }

      props.onValueChange?.(
        Array.isArray(nextValue)
          ? (nextValue[0] ?? null)
          : nextValue === ''
            ? null
            : nextValue
      );
    },
    options,
    multiple: props.multiple,
    maxSelected: props.maxSelected,
    closeOnSelect: props.closeOnSelect,
    disabled: isDisabled,
    open: props.open,
    defaultOpen: props.defaultOpen,
    onOpenChange: props.onOpenChange,
  });

  const optionsByValue = useMemo(
    () =>
      new Map(
        options
          .filter((option) => !option.disabled)
          .map((option) => [option.value, option])
      ),
    [options]
  );

  return {
    ...selection,
    optionsByValue,
  };
}
