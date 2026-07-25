import { cn } from '@utils/cn';

import { useTabsContext } from '../internal/TabsContext';

import type { TabsListProps } from './types';

import styles from './TabsList.module.scss';

export const TabsList = ({ children, className, ...props }: TabsListProps) => {
  const { orientation, variant } = useTabsContext();

  return (
    <div
      {...props}
      role='tablist'
      aria-orientation={orientation}
      className={cn(
        styles.list,
        orientation === 'vertical' && styles.vertical,
        variant === 'line' && styles.underline,
        variant === 'pills' && styles.pills,
        variant === 'segmented' && styles.default,
        className
      )}
    >
      {children}
    </div>
  );
};

TabsList.displayName = 'TabsList';
