import { useEffect, useState } from 'react';

import { cn } from '@utils/cn';

import { useTabsContext } from '../internal/TabsContext';

import type { TabsContentProps } from './types';

import styles from './TabsContent.module.scss';

export const TabsContent = ({
  index,
  children,
  className,
  ...props
}: TabsContentProps) => {
  const { activeIndex, orientation } = useTabsContext();
  const [isVisible, setIsVisible] = useState(false);
  const isActive = activeIndex === index;

  useEffect(() => {
    if (!isActive) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => setIsVisible(true), 10);

    return () => clearTimeout(timer);
  }, [isActive]);

  return (
    <div
      {...props}
      role='tabpanel'
      id={`tab-panel-${index}`}
      aria-labelledby={`tab-${index}`}
      hidden={!isActive}
      tabIndex={0}
      className={cn(
        styles.panel,
        isVisible && styles.visible,
        orientation === 'vertical' && styles.vertical,
        className
      )}
    >
      {children}
    </div>
  );
};

TabsContent.displayName = 'Tabs.Content';
