import type { BaseTabsPanelProps } from '@vellira-ui/types';
import type { HTMLAttributes, ReactNode } from 'react';

export interface TabsContentProps
  extends BaseTabsPanelProps, Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode;
}
