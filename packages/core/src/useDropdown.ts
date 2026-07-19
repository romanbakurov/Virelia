import { useCallback, useEffect, useState } from 'react';

import {
  type KeyboardNavigationEvent,
  type NavigableItem,
  useKeyboardNavigation,
} from './useKeyboardNavigation.js';

export interface UseDropdownParams<TItem extends NavigableItem> {
  items: TItem[];
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (value: string) => void;
  getItemValue: (item: TItem, index: number) => string;
  getItemText?: (item: TItem) => string;
  loop?: boolean;
}

export const useDropdown = <TItem extends NavigableItem>({
  items,
  open,
  defaultOpen = false,
  disabled = false,
  onOpenChange,
  onSelect,
  getItemValue,
  getItemText,
  loop = true,
}: UseDropdownParams<TItem>) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [activeIndex, setActiveIndex] = useState(-1);
  const isControlled = open !== undefined;
  const isOpen = open ?? uncontrolledOpen;

  const getFirstEnabledIndex = useCallback(
    () => items.findIndex((item) => !item.disabled),
    [items]
  );

  const getLastEnabledIndex = useCallback(() => {
    for (let index = items.length - 1; index >= 0; index--) {
      if (!items[index]?.disabled) {
        return index;
      }
    }

    return -1;
  }, [items]);

  const syncActiveIndex = useCallback(
    (nextOpen: boolean, initialIndex?: number) => {
      if (nextOpen) {
        setActiveIndex((currentIndex) => {
          if (currentIndex >= 0 && !items[currentIndex]?.disabled) {
            return currentIndex;
          }

          return initialIndex ?? getFirstEnabledIndex();
        });

        return;
      }

      setActiveIndex(-1);
    },
    [getFirstEnabledIndex, items]
  );

  useEffect(() => {
    syncActiveIndex(isOpen);
  }, [isOpen, syncActiveIndex]);

  const setOpen = useCallback(
    (nextOpen: boolean, initialIndex?: number) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
      syncActiveIndex(nextOpen, initialIndex);
    },
    [isControlled, onOpenChange, syncActiveIndex]
  );

  const openDropdown = useCallback(
    (initialIndex = getFirstEnabledIndex()) => {
      if (disabled) return;

      setOpen(true, initialIndex);
    },
    [disabled, getFirstEnabledIndex, setOpen]
  );

  const closeDropdown = useCallback(() => {
    if (!isOpen) return;

    setOpen(false);
  }, [isOpen, setOpen]);

  const toggleDropdown = useCallback(() => {
    if (disabled) return;

    if (isOpen) {
      setOpen(false);
      return;
    }

    openDropdown();
  }, [disabled, isOpen, openDropdown, setOpen]);

  const selectItem = useCallback(
    (item: TItem) => {
      if (item.disabled) return;

      onSelect?.(getItemValue(item, items.indexOf(item)));
      closeDropdown();
    },
    [closeDropdown, getItemValue, items, onSelect]
  );

  const selectActiveItem = useCallback(() => {
    const item = items[activeIndex];
    if (!item) return;

    selectItem(item);
  }, [activeIndex, items, selectItem]);

  const { onKeyDown } = useKeyboardNavigation({
    activeIndex,
    setActiveIndex,
    items,
    isOpen,
    onOpen: (event: KeyboardNavigationEvent) => {
      openDropdown(
        event.key === 'ArrowUp' ? getLastEnabledIndex() : getFirstEnabledIndex()
      );
    },
    onSelect: selectActiveItem,
    onClose: closeDropdown,
    getItemText,
    loop,
  });

  return {
    activeIndex,
    setActiveIndex,
    isOpen,
    open: isOpen,
    setOpen,
    openDropdown,
    closeDropdown,
    toggleDropdown,
    selectItem,
    select: selectItem,
    selectActiveItem,
    onKeyDown,
    getFirstEnabledIndex,
    getLastEnabledIndex,
  };
};
