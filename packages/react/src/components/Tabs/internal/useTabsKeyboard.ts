import type { Orientation, TabsActivationMode } from '@vellira-ui/types';
import type { KeyboardEvent } from 'react';

import type { RegisteredTab } from './types';

export interface UseTabsKeyboardParams {
  value: string;
  setValue: (value: string) => void;
  getTabs: () => RegisteredTab[];
  orientation: Orientation;
  activationMode: TabsActivationMode;
  loop: boolean;
}

export const useTabsKeyboard = ({
  value,
  setValue,
  getTabs,
  orientation,
  activationMode,
  loop,
}: UseTabsKeyboardParams) => {
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const tabs = getTabs().filter((tab) => !tab.disabled);

    if (tabs.length === 0) return;

    const currentIndex = tabs.findIndex((tab) => tab.value === value);

    const focusTab = (nextIndex: number) => {
      const nextTab = tabs[nextIndex];

      if (!nextTab) return;

      event.preventDefault();
      nextTab.element.focus();

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
          focusTab(getNextIndex());
        }
        break;

      case 'ArrowLeft':
        if (orientation === 'horizontal') {
          focusTab(getPreviousIndex());
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
            setValue(focusedTab.value);
          }
        }
        break;
    }
  };

  return { onKeyDown };
};
