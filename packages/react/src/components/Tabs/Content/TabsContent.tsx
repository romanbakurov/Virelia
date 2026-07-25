import { cn } from '@utils/cn';

import { useTabsContext } from '../internal/TabsContext';

import type { TabsContentProps } from './types';

import styles from './TabsContent.module.scss';

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
    getTriggerId,
    getContentId,
  } = useTabsContext();

  const isActive = selectedValue === value;

  if (!forceMount && !isActive) {
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
        styles.content,
        orientation === 'vertical' && styles.vertical,
        className
      )}
    >
      {children}
    </div>
  );
};

TabsContent.displayName = 'Tabs.Content';
