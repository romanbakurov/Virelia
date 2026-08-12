import type { HTMLAttributes, ReactNode } from 'react';

export interface PopoverAnchorProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /** Element used as the positioning anchor. */
  children: ReactNode;
  /** Composes anchor behavior onto a single child element. */
  asChild?: boolean;
}
