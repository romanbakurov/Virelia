import type { HTMLAttributes, ReactNode } from 'react';

export interface PopoverDescriptionProps extends Omit<
  HTMLAttributes<HTMLParagraphElement>,
  'children'
> {
  children: ReactNode;
  asChild?: boolean;
}
