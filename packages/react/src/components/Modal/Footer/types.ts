import type { ReactNode } from 'react';

export interface ModalFooterProps {
  /** Footer actions or custom footer content. */
  children: ReactNode;
  /** Class name applied to the footer element. */
  className?: string;
}
