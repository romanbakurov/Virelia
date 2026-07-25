import type { BaseTabsContentProps } from '@vellira-ui/types';
import type { HTMLAttributes, ReactNode } from 'react';

export interface TabsContentProps
  extends
    BaseTabsContentProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'value'> {
  children: ReactNode;
}
