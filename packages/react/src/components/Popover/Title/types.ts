import type { HTMLAttributes, ReactNode } from 'react';

export interface PopoverTitleProps extends Omit<
  HTMLAttributes<HTMLHeadingElement>,
  'children'
> {
  /** Title text for popover content. */
  children: ReactNode;
  /** Composes title behavior onto a single child element. */
  asChild?: boolean;
}
