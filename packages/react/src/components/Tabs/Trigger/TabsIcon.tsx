import { cn } from '@utils/cn';

import type { TabsSlotProps } from './types';

import styles from './TabsTrigger.module.scss';

export const TabsIcon = ({ children, className }: TabsSlotProps) => (
  <span className={cn(styles.icon, className)} aria-hidden='true'>
    {children}
  </span>
);

TabsIcon.displayName = 'Tabs.Icon';
