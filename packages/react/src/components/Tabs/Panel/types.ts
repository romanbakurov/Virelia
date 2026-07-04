import type { BaseTabsPanelProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';

export interface TabsPanelProps extends BaseTabsPanelProps {
  children: ReactNode;
  className?: string;
}
