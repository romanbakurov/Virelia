import { useCallback } from 'react';

export interface NavigableItem {
  disabled?: boolean;
}

export interface KeyboardNavigationEvent {
  key: string;
  preventDefault: () => void;
}

export interface UseKeyboardNavigationParams<TItem extends NavigableItem> {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  items: TItem[];
  isOpen: boolean;
  onOpen: () => void;
  onSelect?: () => void;
  onClose?: () => void;
}

export const useKeyboardNavigation = <TItem extends NavigableItem>({
  activeIndex,
  setActiveIndex,
  items,
  isOpen,
  onOpen,
  onSelect,
  onClose,
}: UseKeyboardNavigationParams<TItem>) => {
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
          onOpen();
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
          setActiveIndex(items.findIndex((item) => !item.disabled));
          break;

        case 'End':
          event.preventDefault();
          for (let i = items.length - 1; i >= 0; i--) {
            if (!items[i].disabled) {
              setActiveIndex(i);
              break;
            }
          }
          break;

        case 'Tab':
          onClose?.();
          break;
      }
    },
    [
      activeIndex,
      items,
      isOpen,
      onOpen,
      onSelect,
      onClose,
      setActiveIndex,
      getNextEnabledIndex,
    ]
  );

  return { onKeyDown };
};
