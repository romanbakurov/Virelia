import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface PopoverCloseProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  children: ReactNode;
  asChild?: boolean;
}
