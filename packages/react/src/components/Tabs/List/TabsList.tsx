import { cn } from '@utils/cn';

import { useTabsContext } from '../internal/TabsContext';

import type { TabsListProps } from './types';

import styles from './TabsList.module.scss';

export const TabsList = ({
  children,
  className,
  scrollable: scrollableProp,
  ...props
}: TabsListProps) => {
  const { mode, orientation, variant } = useTabsContext();
  const scrollable = scrollableProp ?? false;

  return (
    <div
      {...props}
      role={mode === 'tabs' ? 'tablist' : undefined}
      aria-orientation={mode === 'tabs' ? orientation : undefined}
      data-orientation={orientation}
      data-variant={variant}
      data-scrollable={scrollable ? '' : undefined}
      className={cn(
        styles.list,
        orientation === 'vertical' && styles.vertical,
        variant === 'line' && styles.line,
        variant === 'pills' && styles.pills,
        variant === 'segmented' && styles.segmented,
        scrollable && styles.scrollable,
        className
      )}
    >
      {children}
    </div>
  );
};

TabsList.displayName = 'TabsList';
