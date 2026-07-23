import type { BaseTabsProps } from '@vellira-ui/types';
import type { HTMLAttributes, ReactNode } from 'react';

export interface TabsRootProps
  extends
    BaseTabsProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'children'> {
  children: ReactNode;
  className?: string;
}
