import type { ReactElement } from 'react';

export type ModalCloseProps = {
  /** Composes close behavior onto a single child element. */
  asChild?: boolean;
  /** Custom close button element. */
  children?: ReactElement;
  /** Accessible name for the close button. */
  'aria-label'?: string;
  /** Class name applied to the close button. */
  className?: string;
};
