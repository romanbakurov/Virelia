import { forwardRef, useCallback, useRef, useState } from 'react';

import { useTabsKeyboard } from '@romanbakurov/vellira-core';
import { cn } from '@utils/cn';

import type { TabsContextValue } from './TabsContext';
import { TabsContext } from './TabsContext';
import type { TabsProps } from './types';

import styles from './Tabs.module.scss';

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      children,
      activeIndex: controlledActiveIndex,
      defaultActiveIndex = 0,
      onChange,
      orientation = 'horizontal',
      appearance = 'default',
      className,
      ...props
    },
    ref
  ) => {
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
          {...props}
          ref={ref}
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
  }
);

Tabs.displayName = 'Tabs';

export default Tabs;
