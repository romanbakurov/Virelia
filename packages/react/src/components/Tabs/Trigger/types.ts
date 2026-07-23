import type { BaseTabProps } from '@vellira-ui/types';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface TabsTriggerProps
  extends
    BaseTabProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'disabled'> {
  children: ReactNode;
  icon?: ReactNode;
}
