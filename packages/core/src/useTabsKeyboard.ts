import { useCallback } from 'react';

import type { MutableRefObject } from 'react';

export interface TabsKeyboardEvent {
  key: string;
  preventDefault: () => void;
}

export interface TabKeyboardItem {
  disabled?: boolean;
  focus?: () => void;
  props?: {
    disabled?: boolean;
  };
}

export interface UseTabsKeyboardParams<TItem extends TabKeyboardItem> {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  tabRefs: MutableRefObject<(TItem | null)[]>;
  orientation: 'horizontal' | 'vertical';
}

export const useTabsKeyboard = <TItem extends TabKeyboardItem>({
  activeIndex,
  setActiveIndex,
  tabRefs,
  orientation = 'horizontal',
}: UseTabsKeyboardParams<TItem>) => {
  const onKeyDown = useCallback(
    (event: TabsKeyboardEvent) => {
      const isTabDisabled = (tab: TItem | null) => {
        return Boolean(tab?.disabled || tab?.props?.disabled);
      };
      const getNextEnabledIndex = (current: number, direction: 1 | -1) => {
        const total = tabRefs.current.length;
        if (!total) return current;
        let index = current;

        for (let i = 0; i < total; i++) {
          index = (index + direction + total) % total;

          const tab = tabRefs.current[index];

          if (tab && !isTabDisabled(tab)) {
            return index;
          }
        }

        return current;
      };

      const getFirstEnabledIndex = () => {
        return tabRefs.current.findIndex((tab) => tab && !isTabDisabled(tab));
      };

      const getLastEnabledIndex = () => {
        for (let i = tabRefs.current.length - 1; i >= 0; i--) {
          const tab = tabRefs.current[i];

          if (tab && !isTabDisabled(tab)) {
            return i;
          }
        }

        return activeIndex;
      };

      let nextIndex = activeIndex;

      switch (event.key) {
        case 'ArrowLeft':
          if (orientation === 'horizontal') {
            event.preventDefault();
            nextIndex = getNextEnabledIndex(activeIndex, -1);
          }
          break;

        case 'ArrowRight':
          if (orientation === 'horizontal') {
            event.preventDefault();
            nextIndex = getNextEnabledIndex(activeIndex, 1);
          }
          break;

        case 'ArrowUp':
          if (orientation === 'vertical') {
            event.preventDefault();
            nextIndex = getNextEnabledIndex(activeIndex, -1);
          }
          break;

        case 'ArrowDown':
          if (orientation === 'vertical') {
            event.preventDefault();
            nextIndex = getNextEnabledIndex(activeIndex, 1);
          }
          break;

        case 'Home': {
          event.preventDefault();

          const firstEnabledIndex = getFirstEnabledIndex();

          nextIndex =
            firstEnabledIndex === -1 ? activeIndex : firstEnabledIndex;
          break;
        }

        case 'End':
          event.preventDefault();
          nextIndex = getLastEnabledIndex();
          break;

        default:
          return;
      }

      if (nextIndex !== activeIndex) {
        setActiveIndex(nextIndex);
        tabRefs.current[nextIndex]?.focus?.();
      }
    },
    [activeIndex, orientation, setActiveIndex, tabRefs]
  );

  return { onKeyDown };
};
