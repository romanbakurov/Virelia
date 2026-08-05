import type { HTMLAttributes, ReactNode } from 'react';

export interface PopoverAnchorProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  children: ReactNode;
  asChild?: boolean;
}
