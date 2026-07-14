import { useCallback, useRef } from 'react';

import { useControllableState } from './useControllableState.js';
import { type TabKeyboardItem, useTabsKeyboard } from './useTabsKeyboard.js';

export interface UseTabsParams {
  activeIndex?: number;
  defaultActiveIndex?: number;
  onChange?: (index: number) => void;
  orientation?: 'horizontal' | 'vertical';
}

export const useTabs = <TTab extends TabKeyboardItem>({
  activeIndex: controlledActiveIndex,
  defaultActiveIndex = 0,
  onChange,
  orientation = 'horizontal',
}: UseTabsParams) => {
  const [activeIndex, setActiveIndex] = useControllableState({
    value: controlledActiveIndex,
    defaultValue: defaultActiveIndex,
    onChange,
  });

  const tabRefs = useRef<(TTab | null)[]>([]);

  const registerTab = useCallback((index: number, el: TTab | null) => {
    tabRefs.current[index] = el;
  }, []);

  const { onKeyDown } = useTabsKeyboard<TTab>({
    activeIndex,
    setActiveIndex,
    tabRefs,
    orientation,
  });

  return {
    activeIndex,
    setActiveIndex,
    tabRefs,
    registerTab,
    onKeyDown,
  };
};
