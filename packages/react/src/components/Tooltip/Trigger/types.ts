import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';

export interface TooltipTriggerProps extends HTMLAttributes<HTMLElement> {
  /** Composes trigger behavior onto a single child element. */
  asChild?: boolean;
  /** Trigger content. */
  children: ReactNode;
  /** Disables tooltip interaction for this trigger. */
  disabled?: boolean;
}

export type TooltipTriggerElement = ReactElement<
  HTMLAttributes<HTMLElement> & {
    /** Disables tooltip interaction on the composed child. */
    disabled?: boolean;
    /** Ref forwarded to the composed trigger child. */
    ref?: Ref<HTMLElement>;
  }
>;
