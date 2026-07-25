import { useCallback, useId, useRef } from 'react';

import { cn } from '@utils/cn';

import { useTabs } from '@/hooks';

import { TabsContext } from '../internal/TabsContext';
import type { RegisteredTab, TabsContextValue } from '../internal/types';
import { useTabsKeyboard } from '../internal/useTabsKeyboard';

import type { TabsProps } from './types';

import styles from '../Tabs.module.scss';

export const TabsRoot = ({
  children,
  value: controlledValue,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  activationMode = 'automatic',
  loop = true,
  variant = 'line',
  color = 'primary',
  size = 'md',
  keepMounted = false,
  lazyMount = false,
  className,
}: TabsProps) => {
  const baseId = useId();

  const { value, setValue } = useTabs({
    value: controlledValue,
    defaultValue,
    onValueChange,
  });

  const tabsRef = useRef<RegisteredTab[]>([]);

  const registerTrigger = useCallback(
    (
      triggerValue: string,
      element: HTMLButtonElement | null,
      disabled = false
    ) => {
      const existingIndex = tabsRef.current.findIndex(
        (tab) => tab.value === triggerValue
      );

      if (!element) {
        if (existingIndex >= 0) {
          tabsRef.current.splice(existingIndex, 1);
        }

        return;
      }

      const nextTab: RegisteredTab = {
        value: triggerValue,
        element,
        disabled,
      };

      if (existingIndex >= 0) {
        tabsRef.current[existingIndex] = nextTab;
      } else {
        tabsRef.current.push(nextTab);
      }

      tabsRef.current.sort((a, b) => {
        if (a.element === b.element) return 0;

        const position = a.element.compareDocumentPosition(b.element);

        return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
      });
    },
    []
  );

  const { onKeyDown } = useTabsKeyboard({
    value,
    setValue,
    getTabs: () => tabsRef.current,
    orientation,
    activationMode,
    loop,
  });

  const getTriggerId = useCallback(
    (triggerValue: string) => `${baseId}-trigger-${triggerValue}`,
    [baseId]
  );

  const getContentId = useCallback(
    (contentValue: string) => `${baseId}-content-${contentValue}`,
    [baseId]
  );

  const contextValue: TabsContextValue = {
    value,
    setValue,

    orientation,
    activationMode,
    loop,

    variant,
    color,
    size,

    keepMounted,
    lazyMount,

    registerTrigger,
    onTriggerKeyDown: onKeyDown,
    getTriggerId,
    getContentId,
  };

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        className={cn(
          styles.tabs,
          orientation === 'vertical' && styles.vertical,
          className
        )}
        data-orientation={orientation}
        data-variant={variant}
        data-color={color}
        data-size={size}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
};

TabsRoot.displayName = 'Tabs';
