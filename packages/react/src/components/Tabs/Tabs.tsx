import { useCallback, useRef } from 'react';

import { cn } from '@utils/cn';

import { useTabs, useTabsKeyboard } from '@/hooks';

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
  const { activeIndex, setActiveIndex } = useTabs({
    activeIndex: controlledActiveIndex,
    defaultActiveIndex,
    onChange,
  });

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
    onNavigate: (index) => {
      tabRefs.current[index]?.focus();
    },
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
