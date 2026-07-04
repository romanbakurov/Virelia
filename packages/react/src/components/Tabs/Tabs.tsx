import { useCallback, useRef, useState } from 'react';

import { cn } from '@utils/cn';
import { useTabsKeyboard } from '@vellira-ui/core';

import type { TabsContextValue } from './TabsContext';
import { TabsContext } from './TabsContext';
import type { TabsProps } from './types';

import styles from './Tabs.module.scss';

export const Tabs = ({
  children,
  activeIndex: controlledActiveIndex,
  defaultActiveIndex = 0,
  onChange,
  orientation = 'horizontal',
  appearance = 'default',
  className,
}: TabsProps) => {
  const [uncontrolledActiveIndex, setUncontrolledActiveIndex] =
    useState(defaultActiveIndex);
  const isControlled = controlledActiveIndex !== undefined;
  const activeIndex = isControlled
    ? controlledActiveIndex
    : uncontrolledActiveIndex;

  const setActiveIndex = useCallback(
    (nextIndex: number) => {
      if (!isControlled) {
        setUncontrolledActiveIndex(nextIndex);
      }

      onChange?.(nextIndex);
    },
    [isControlled, onChange]
  );

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const registerTab = useCallback(
    (index: number, el: HTMLButtonElement | null) => {
      tabRefs.current[index] = el;
    },
    []
  );

  const { onKeyDown } = useTabsKeyboard<HTMLButtonElement>({
    activeIndex,
    setActiveIndex,
    tabRefs,
    orientation,
  });

  const contextValue: TabsContextValue = {
    activeIndex,
    setActiveIndex,
    orientation,
    appearance,

    registerTab,
    onTabKeyDown: onKeyDown,
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        className={cn(
          styles.tabs,
          orientation === 'vertical' && styles.vertical,
          className
        )}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
};

Tabs.displayName = 'Tabs';

export default Tabs;
