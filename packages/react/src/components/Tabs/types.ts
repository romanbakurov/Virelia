import type { BaseTabsProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';

export interface TabsProps extends BaseTabsProps {
  children: ReactNode;
  className?: string;
}
