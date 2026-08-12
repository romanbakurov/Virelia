import type { HTMLAttributes, ReactNode } from 'react';

export interface PopoverDescriptionProps extends Omit<
  HTMLAttributes<HTMLParagraphElement>,
  'children'
> {
  /** Description text for popover content. */
  children: ReactNode;
  /** Composes description behavior onto a single child element. */
  asChild?: boolean;
}
