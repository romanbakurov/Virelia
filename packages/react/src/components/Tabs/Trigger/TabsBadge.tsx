import { cn } from '@utils/cn';

import type { TabsSlotProps } from './types';

import styles from './TabsTrigger.module.scss';

export const TabsBadge = ({ children, className }: TabsSlotProps) => (
  <span className={cn(styles.badge, className)}>{children}</span>
);

TabsBadge.displayName = 'Tabs.Badge';
