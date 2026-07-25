import { cn } from '@utils/cn';
import type { HTMLAttributes } from 'react';

import { useTabsIndicator } from '../internal/useTabsIndicator';

import styles from './TabsList.module.scss';

export interface TabsIndicatorProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children'
> {
  className?: string;
}

export const TabsIndicator = ({
  className,
  style,
  ...props
}: TabsIndicatorProps) => {
  const { ref, style: indicatorStyle } = useTabsIndicator();

  return (
    <span
      {...props}
      ref={ref}
      aria-hidden='true'
      className={cn(styles.indicator, className)}
      style={{ ...indicatorStyle, ...style }}
    />
  );
};

TabsIndicator.displayName = 'Tabs.Indicator';
