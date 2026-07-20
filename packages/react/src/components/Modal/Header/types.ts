import type { ReactNode } from 'react';

export interface ModalHeaderProps {
  children?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  showClose?: boolean;
  className?: string;
}
