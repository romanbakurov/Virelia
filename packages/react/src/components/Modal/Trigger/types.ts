import type { ReactNode } from 'react';

export type ModalTriggerProps = {
  /** Trigger content. */
  children: ReactNode;
  /** Composes trigger behavior onto a single child element. */
  asChild?: boolean;
  /** Disables trigger interaction. */
  disabled?: boolean;
  /** Class name applied to the trigger element. */
  className?: string;
};
