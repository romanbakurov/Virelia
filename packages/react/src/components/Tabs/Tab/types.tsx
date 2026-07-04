import type { BaseTabProps } from '@vellira-ui/types';
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';

export interface TabProps extends BaseTabProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement> | null) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLButtonElement> | null) => void;
}
