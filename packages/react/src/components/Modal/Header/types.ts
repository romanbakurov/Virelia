import type { ReactNode } from 'react';

export interface ModalHeaderProps {
  /** Header content, typically title and description. */
  children: ReactNode;
  /** Class name applied to the header element. */
  className?: string;
}
