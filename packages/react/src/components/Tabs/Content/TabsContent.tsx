import { useEffect, useState } from 'react';

import { useTabsContext } from '../internal/TabsContext';

import type { TabsContentProps } from './types';

import styles from './TabsContent.module.scss';

import { cn } from '#utils/cn';

export const TabsContent = ({
  value,
  children,
  className,
  forceMount = false,
  ...props
}: TabsContentProps) => {
  const {
    value: selectedValue,
    orientation,
    keepMounted,
    lazyMount,
    registerContent,
    getTriggerId,
    getContentId,
  } = useTabsContext();

  const isActive = selectedValue === value;
  const [hasMounted, setHasMounted] = useState(isActive);

  useEffect(() => {
    registerContent(value, true);

    return () => {
      registerContent(value, false);
    };
  }, [registerContent, value]);

  useEffect(() => {
    if (isActive) {
      setHasMounted(true);
    }
  }, [isActive]);

  const shouldMount =
    forceMount ||
    isActive ||
    (keepMounted && !lazyMount) ||
    (keepMounted && lazyMount && hasMounted);

  if (!shouldMount) {
    return null;
  }

  return (
    <div
      {...props}
      role='tabpanel'
      id={getContentId(value)}
      aria-labelledby={getTriggerId(value)}
      hidden={!isActive}
      tabIndex={0}
      data-state={isActive ? 'active' : 'inactive'}
      data-orientation={orientation}
      className={cn(
        styles.panel,
        isActive && styles.visible,
        orientation === 'vertical' && styles.vertical,
        className
      )}
    >
      {children}
    </div>
  );
};

TabsContent.displayName = 'Tabs.Content';
