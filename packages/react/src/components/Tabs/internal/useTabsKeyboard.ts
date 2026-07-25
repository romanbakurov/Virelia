import type { Orientation, TabsActivationMode } from '@vellira-ui/types';
import type { KeyboardEvent } from 'react';

import type { RegisteredTab } from './types';

export interface UseTabsKeyboardParams {
  focusedValue?: string;
  setValue: (value: string) => void;
  setFocusedValue: (value: string) => void;
  getTabs: () => RegisteredTab[];
  orientation: Orientation;
  activationMode: TabsActivationMode;
  dir: 'ltr' | 'rtl';
  loop: boolean;
}

export const useTabsKeyboard = ({
  focusedValue,
  setValue,
  setFocusedValue,
  getTabs,
  orientation,
  activationMode,
  dir,
  loop,
}: UseTabsKeyboardParams) => {
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const tabs = getTabs().filter((tab) => !tab.disabled);

    if (tabs.length === 0) return;

    const activeElementIndex = tabs.findIndex(
      (tab) => tab.element === document.activeElement
    );
    const focusedIndex = tabs.findIndex((tab) => tab.value === focusedValue);
    const currentIndex =
      activeElementIndex >= 0
        ? activeElementIndex
        : focusedIndex >= 0
          ? focusedIndex
          : 0;

    const focusTab = (nextIndex: number) => {
      const nextTab = tabs[nextIndex];

      if (!nextTab) return;

      event.preventDefault();
      setFocusedValue(nextTab.value);
      nextTab.element.focus();
      nextTab.element.scrollIntoView?.({
        block: 'nearest',
        inline: 'nearest',
      });

      if (activationMode === 'automatic') {
        setValue(nextTab.value);
      }
    };

    const getNextIndex = () => {
      if (currentIndex < tabs.length - 1) return currentIndex + 1;
      return loop ? 0 : currentIndex;
    };

    const getPreviousIndex = () => {
      if (currentIndex > 0) return currentIndex - 1;
      return loop ? tabs.length - 1 : currentIndex;
    };

    switch (event.key) {
      case 'ArrowRight':
        if (orientation === 'horizontal') {
          focusTab(dir === 'rtl' ? getPreviousIndex() : getNextIndex());
        }
        break;

      case 'ArrowLeft':
        if (orientation === 'horizontal') {
          focusTab(dir === 'rtl' ? getNextIndex() : getPreviousIndex());
        }
        break;

      case 'ArrowDown':
        if (orientation === 'vertical') {
          focusTab(getNextIndex());
        }
        break;

      case 'ArrowUp':
        if (orientation === 'vertical') {
          focusTab(getPreviousIndex());
        }
        break;

      case 'Home':
        focusTab(0);
        break;

      case 'End':
        focusTab(tabs.length - 1);
        break;

      case 'Enter':
      case ' ':
        if (activationMode === 'manual') {
          const focusedTab = tabs.find(
            (tab) => tab.element === document.activeElement
          );

          if (focusedTab) {
            event.preventDefault();
            setFocusedValue(focusedTab.value);
            setValue(focusedTab.value);
          }
        }
        break;
    }
  };

  return { onKeyDown };
};
