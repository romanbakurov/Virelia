import type { TabsSlotProps } from './types';

import styles from './TabsTrigger.module.scss';

import { cn } from '#utils/cn';

export const TabsIcon = ({ children, className }: TabsSlotProps) => (
  <span className={cn(styles.icon, className)} aria-hidden='true'>
    {children}
  </span>
);

TabsIcon.displayName = 'Tabs.Icon';
