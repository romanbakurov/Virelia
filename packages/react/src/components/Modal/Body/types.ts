import type { ReactNode } from 'react';

export interface ModalBodyProps {
  /** Main modal body content. */
  children: ReactNode;
  /** Class name applied to the body element. */
  className?: string;
}
