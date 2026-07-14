import { useCallback, useMemo, useState } from 'react';

import { useControllableState } from './useControllableState.js';
import {
  type NavigableItem,
  useKeyboardNavigation,
} from './useKeyboardNavigation.js';

export interface SelectOptionLike extends NavigableItem {
  label: string;
  value: string;
}

export interface UseSelectParams<TOption extends SelectOptionLike> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: TOption[];
  disabled?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const useSelect = <TOption extends SelectOptionLike>({
  value,
  defaultValue,
  onChange,
  options,
  disabled = false,
  open,
  defaultOpen = false,
  onOpenChange,
}: UseSelectParams<TOption>) => {
  const [selectedValue, setSelectedValue] = useControllableState({
    value,
    defaultValue: defaultValue ?? '',
    onChange,
  });

  const [isOpen, setIsOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [activeIndex, setActiveIndex] = useState(-1);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValue),
    [options, selectedValue]
  );

  const getInitialActiveIndex = useCallback(() => {
    const selectedIndex = options.findIndex(
      (option) => option.value === selectedValue && !option.disabled
    );

    if (selectedIndex >= 0) return selectedIndex;

    return options.findIndex((option) => !option.disabled);
  }, [options, selectedValue]);

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

  const selectValue = useCallback(
    (nextValue: string) => {
      const nextOption = options.find((option) => option.value === nextValue);

      if (!nextOption || nextOption.disabled) return;

      setSelectedValue(nextValue);
      closeDropdown();
    },
    [closeDropdown, options, setSelectedValue]
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
    setSelectedValue,
    selectedOption,
    isOpen,
    setIsOpen,
    activeIndex,
    setActiveIndex,
    getInitialActiveIndex,
    openDropdown,
    closeDropdown,
    toggleDropdown,
    selectValue,
    selectActiveOption,
    onKeyDown,
  };
};
