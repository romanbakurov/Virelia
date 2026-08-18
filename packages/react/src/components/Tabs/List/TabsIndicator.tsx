import { useTabsIndicator } from '../internal/useTabsIndicator';

import type { TabsIndicatorProps } from './types';

import styles from './TabsList.module.scss';

import { cn } from '#utils/cn';

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
