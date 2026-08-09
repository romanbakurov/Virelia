import { useCallback } from 'react';

import type { MutableRefObject } from 'react';

import type { SelectOption } from '../types';

type UseSelectRootActionsParams = {
  multiple: boolean;
  maxSelected: number | undefined;
  closeOnSelect: boolean | undefined;
  selectedValues: string[];
  optionsByValue: Map<string, SelectOption>;
  selectedFocusValueRef: MutableRefObject<string | undefined>;
  selectValue: (value: string) => void;
  setSelectedValue: (value: string | string[]) => void;
  announce: (message: string) => void;
  closeAndFocusTrigger: () => void;
};

export function useSelectRootActions({
  multiple,
  maxSelected,
  closeOnSelect,
  selectedValues,
  optionsByValue,
  selectedFocusValueRef,
  selectValue,
  setSelectedValue,
  announce,
  closeAndFocusTrigger,
}: UseSelectRootActionsParams) {
  const clearValue = useCallback(() => {
    selectedFocusValueRef.current = undefined;
    selectValue('');
    announce('Selection cleared');
  }, [announce, selectValue, selectedFocusValueRef]);

  const selectOption = useCallback(
    (option: SelectOption) => {
      if (option.disabled) return;

      const selectedBefore = selectedValues.includes(option.value);
      const maxReached =
        multiple &&
        !selectedBefore &&
        typeof maxSelected === 'number' &&
        selectedValues.length >= maxSelected;

      if (maxReached) return;

      selectedFocusValueRef.current = option.value;
      selectValue(option.value);
      announce(`${option.label} selected`);
    },
    [
      announce,
      maxSelected,
      multiple,
      selectValue,
      selectedFocusValueRef,
      selectedValues,
    ]
  );

  const selectGroup = useCallback(
    (values: string[]) => {
      if (!multiple || values.length === 0) return;

      const enabledValues = values.filter((value) => optionsByValue.has(value));
      const selectedGroupValues = enabledValues.filter((value) =>
        selectedValues.includes(value)
      );
      const outsideSelectedCount = selectedValues.filter(
        (value) => !enabledValues.includes(value)
      ).length;
      const maxSelectableGroupCount =
        typeof maxSelected === 'number'
          ? Math.max(
              0,
              Math.min(enabledValues.length, maxSelected - outsideSelectedCount)
            )
          : enabledValues.length;

      const shouldClearGroup =
        selectedGroupValues.length > 0 &&
        selectedGroupValues.length >= maxSelectableGroupCount;

      if (shouldClearGroup) {
        selectedFocusValueRef.current = undefined;

        setSelectedValue(
          selectedValues.filter((value) => !enabledValues.includes(value))
        );

        announce('Group selection cleared');

        return;
      }

      const nextValues = [...selectedValues];

      for (const value of enabledValues) {
        if (nextValues.includes(value)) continue;

        if (
          typeof maxSelected === 'number' &&
          nextValues.length >= maxSelected
        ) {
          break;
        }

        nextValues.push(value);
      }

      setSelectedValue(nextValues);
      selectedFocusValueRef.current = nextValues.at(-1);
      announce('Group selected');

      if (closeOnSelect) {
        closeAndFocusTrigger();
      }
    },
    [
      announce,
      closeAndFocusTrigger,
      closeOnSelect,
      maxSelected,
      multiple,
      optionsByValue,
      selectedFocusValueRef,
      selectedValues,
      setSelectedValue,
    ]
  );

  return {
    clearValue,
    selectOption,
    selectGroup,
  };
}
