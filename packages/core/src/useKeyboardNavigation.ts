import { useCallback, useEffect, useRef } from 'react';

export interface NavigableItem {
  disabled?: boolean;
}

export interface KeyboardNavigationEvent {
  key: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  preventDefault: () => void;
}

export interface UseKeyboardNavigationParams<TItem extends NavigableItem> {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  items: TItem[];
  isOpen: boolean;
  onOpen: (event: KeyboardNavigationEvent) => void;
  onSelect?: () => void;
  onClose?: () => void;
  getItemText?: (item: TItem) => string;
}

export const useKeyboardNavigation = <TItem extends NavigableItem>({
  activeIndex,
  setActiveIndex,
  items,
  isOpen,
  onOpen,
  onSelect,
  onClose,
  getItemText,
}: UseKeyboardNavigationParams<TItem>) => {
  const searchRef = useRef({
    value: '',
    timeoutId: undefined as ReturnType<typeof setTimeout> | undefined,
  });

  useEffect(
    () => () => {
      if (searchRef.current.timeoutId) {
        clearTimeout(searchRef.current.timeoutId);
      }
    },
    []
  );

  const getNextEnabledIndex = useCallback(
    (current: number, direction: 1 | -1) => {
      if (!items.length) return current;

      let index = current;

      for (let i = 0; i < items.length; i++) {
        index = (index + direction + items.length) % items.length;

        if (!items[index]?.disabled) {
          return index;
        }
      }

      return current;
    },
    [items]
  );

  const getFirstEnabledIndex = useCallback(
    () => items.findIndex((item) => !item.disabled),
    [items]
  );

  const getLastEnabledIndex = useCallback(() => {
    for (let i = items.length - 1; i >= 0; i--) {
      if (!items[i].disabled) {
        return i;
      }
    }

    return -1;
  }, [items]);

  const getTypeaheadIndex = useCallback(
    (query: string) => {
      if (!getItemText || !query) return -1;

      const normalizedQuery = query.toLocaleLowerCase();
      const startIndex = activeIndex >= 0 ? activeIndex + 1 : 0;

      for (let offset = 0; offset < items.length; offset++) {
        const index = (startIndex + offset) % items.length;
        const item = items[index];

        if (
          item &&
          !item.disabled &&
          getItemText(item).toLocaleLowerCase().startsWith(normalizedQuery)
        ) {
          return index;
        }
      }

      return -1;
    },
    [activeIndex, getItemText, items]
  );

  const onKeyDown = useCallback(
    (event: KeyboardNavigationEvent) => {
      if (!isOpen) {
        if (
          event.key === ' ' ||
          event.key === 'Enter' ||
          event.key === 'ArrowDown' ||
          event.key === 'ArrowUp'
        ) {
          event.preventDefault();
          onOpen(event);
        }
        return;
      }

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setActiveIndex(getNextEnabledIndex(activeIndex, 1));
          break;

        case 'ArrowUp':
          event.preventDefault();
          setActiveIndex(getNextEnabledIndex(activeIndex, -1));
          break;

        case 'Enter':
        case ' ':
          event.preventDefault();
          onSelect?.();
          break;

        case 'Escape':
          event.preventDefault();
          onClose?.();
          break;

        case 'Home':
          event.preventDefault();
          setActiveIndex(getFirstEnabledIndex());
          break;

        case 'End':
          event.preventDefault();
          setActiveIndex(getLastEnabledIndex());
          break;

        case 'Tab':
          onClose?.();
          break;

        default:
          if (
            event.key.length === 1 &&
            !event.altKey &&
            !event.ctrlKey &&
            !event.metaKey
          ) {
            event.preventDefault();

            if (searchRef.current.timeoutId) {
              clearTimeout(searchRef.current.timeoutId);
            }

            searchRef.current.value += event.key;
            searchRef.current.timeoutId = setTimeout(() => {
              searchRef.current.value = '';
              searchRef.current.timeoutId = undefined;
            }, 700);

            const nextIndex = getTypeaheadIndex(searchRef.current.value);

            if (nextIndex >= 0) {
              setActiveIndex(nextIndex);
            }
          }
          break;
      }
    },
    [
      activeIndex,
      isOpen,
      onOpen,
      onSelect,
      onClose,
      setActiveIndex,
      getNextEnabledIndex,
      getFirstEnabledIndex,
      getLastEnabledIndex,
      getTypeaheadIndex,
    ]
  );

  return { onKeyDown };
};
