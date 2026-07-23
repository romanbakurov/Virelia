import { useCallback, useRef } from 'react';

import { cn } from '@utils/cn';

import { useTabs, useTabsKeyboard } from '@/hooks';

import { TabsContext } from '../internal/TabsContext';
import type { TabsContextValue } from '../internal/types';

import type { TabsRootProps } from './types';

import styles from '../Tabs.module.scss';

export const TabsRoot = ({
  children,
  activeIndex: controlledActiveIndex,
  defaultActiveIndex = 0,
  onChange,
  orientation = 'horizontal',
  appearance = 'default',
  className,
}: TabsRootProps) => {
  const { activeIndex, setActiveIndex } = useTabs({
    activeIndex: controlledActiveIndex,
    defaultActiveIndex,
    onChange,
  });

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const registerTab = useCallback(
    (index: number, element: HTMLButtonElement | null) => {
      tabRefs.current[index] = element;
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

TabsRoot.displayName = 'Tabs';
