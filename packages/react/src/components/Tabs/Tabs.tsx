import { cn } from '@utils/cn';
import { useTabs } from '@vellira-ui/core';

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
  const { activeIndex, setActiveIndex, registerTab, onKeyDown } =
    useTabs<HTMLButtonElement>({
      activeIndex: controlledActiveIndex,
      defaultActiveIndex,
      onChange,
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
