import type { BaseTabsTriggerProps } from '@vellira-ui/types';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface TabsTriggerProps
  extends
    BaseTabsTriggerProps,
    Omit<
      ButtonHTMLAttributes<HTMLButtonElement>,
      'children' | 'disabled' | 'value'
    > {
  children?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  description?: ReactNode;
}

export interface TabsSlotProps {
  children: ReactNode;
  className?: string;
}
