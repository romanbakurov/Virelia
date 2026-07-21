import { useCallback, useEffect, useMemo, useState } from 'react';

import { useControllableState } from './useControllableState';
import {
  type NavigableItem,
  useKeyboardNavigation,
} from './useKeyboardNavigation';

export interface SelectOptionLike extends NavigableItem {
  label: string;
  value: string;
}

export type SelectStateValue = string | string[];

export interface UseSelectParams<TOption extends SelectOptionLike> {
  value?: SelectStateValue;
  defaultValue?: SelectStateValue;
  onValueChange?: (value: SelectStateValue) => void;
  /** @deprecated Use onValueChange. */
  onChange?: (value: SelectStateValue) => void;
  options: TOption[];
  multiple?: boolean;
  maxSelected?: number;
  closeOnSelect?: boolean;
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const useSelect = <TOption extends SelectOptionLike>({
  value,
  defaultValue,
  onValueChange,
  onChange,
  options,
  multiple = false,
  maxSelected,
  closeOnSelect = !multiple,
  disabled = false,
  open,
  defaultOpen = false,
  onOpenChange,
}: UseSelectParams<TOption>) => {
  const [selectedValue, setSelectedValue] = useControllableState({
    value,
    defaultValue: defaultValue ?? (multiple ? [] : ''),
    onChange: onValueChange ?? onChange,
  });

  const [isOpen, setIsOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [activeIndex, setActiveIndex] = useState(-1);

  const selectedValues = useMemo(
    () =>
      Array.isArray(selectedValue)
        ? selectedValue
        : selectedValue
          ? [selectedValue]
          : [],
    [selectedValue]
  );

  const selectedOption = useMemo(
    () => options.find((option) => selectedValues.includes(option.value)),
    [options, selectedValues]
  );

  const selectedOptions = useMemo(
    () => options.filter((option) => selectedValues.includes(option.value)),
    [options, selectedValues]
  );

  const getInitialActiveIndex = useCallback(() => {
    const selectedIndex = options.findIndex(
      (option) => selectedValues.includes(option.value) && !option.disabled
    );

    if (selectedIndex >= 0) return selectedIndex;

    return options.findIndex((option) => !option.disabled);
  }, [options, selectedValues]);

  const openDropdown = useCallback(() => {
    if (disabled) return;

    setActiveIndex(getInitialActiveIndex());
    setIsOpen(true);
  }, [disabled, getInitialActiveIndex, setIsOpen]);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const toggleDropdown = useCallback(() => {
    if (disabled) return;

    if (isOpen) {
      closeDropdown();
      return;
    }

    openDropdown();
  }, [closeDropdown, disabled, isOpen, openDropdown]);

  useEffect(() => {
    if (!isOpen) return;

    setActiveIndex((currentIndex) => {
      const currentOption = options[currentIndex];

      if (currentOption && !currentOption.disabled) {
        return currentIndex;
      }

      return getInitialActiveIndex();
    });
  }, [getInitialActiveIndex, isOpen, options]);

  const selectValue = useCallback(
    (nextValue: string) => {
      if (nextValue === '') {
        setSelectedValue(multiple ? [] : '');
        closeDropdown();
        return;
      }

      const nextOption = options.find((option) => option.value === nextValue);

      if (!nextOption || nextOption.disabled) return;

      if (multiple) {
        const isSelected = selectedValues.includes(nextValue);

        if (
          !isSelected &&
          typeof maxSelected === 'number' &&
          selectedValues.length >= maxSelected
        ) {
          return;
        }

        const nextValues = selectedValues.includes(nextValue)
          ? selectedValues.filter((value) => value !== nextValue)
          : [...selectedValues, nextValue];

        setSelectedValue(nextValues);
        if (closeOnSelect) {
          closeDropdown();
        }
        return;
      }

      setSelectedValue(nextValue);
      setActiveIndex(options.indexOf(nextOption));
      closeDropdown();
    },
    [
      closeDropdown,
      closeOnSelect,
      maxSelected,
      multiple,
      options,
      selectedValues,
      setSelectedValue,
    ]
  );

  const selectActiveOption = useCallback(() => {
    const activeOption = options[activeIndex];

    if (!activeOption) return;

    selectValue(activeOption.value);
  }, [activeIndex, options, selectValue]);

  const { onKeyDown } = useKeyboardNavigation({
    activeIndex,
    setActiveIndex,
    items: options,
    isOpen,
    onOpen: openDropdown,
    onClose: closeDropdown,
    onSelect: selectActiveOption,
    getItemText: (option) => option.label,
  });

  return {
    selectedValue,
    selectedValues,
    setSelectedValue,
    selectedOption,
    selectedOptions,
    isOpen,
    open: isOpen,
    setIsOpen,
    activeIndex,
    setActiveIndex,
    getInitialActiveIndex,
    openDropdown,
    closeDropdown,
    toggleDropdown,
    selectValue,
    select: selectValue,
    selectActiveOption,
    onKeyDown,
  };
};
