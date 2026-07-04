import { forwardRef } from 'react';

import { cn } from '@utils/cn';

import { useTabs } from '../TabsContext';

import type { TabsListProps } from './types';

import styles from './TabsList.module.scss';

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ children, className, ...props }, ref) => {
    const { orientation, appearance } = useTabs();

    return (
      <div
        {...props}
        ref={ref}
        role='tablist'
        aria-orientation={orientation}
        className={cn(
          styles.list,
          orientation === 'vertical' && styles.vertical,
          appearance === 'underline' && styles.underline,
          appearance === 'pills' && styles.pills,
          className
        )}
      >
        {children}
      </div>
    );
  }
);

TabsList.displayName = 'TabsList';
