import type { ReactNode } from 'react';

export interface SelectValueProps {
  /** Custom value content; defaults to the current selected value text. */
  children?: ReactNode;
  /** Class name applied to the value wrapper. */
  className?: string;
}
