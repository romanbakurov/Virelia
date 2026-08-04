import type { HTMLAttributes, ReactNode } from 'react';

export interface PopoverTitleProps extends Omit<
  HTMLAttributes<HTMLHeadingElement>,
  'children'
> {
  children: ReactNode;
  asChild?: boolean;
}
