import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface PopoverCloseProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  /** Close button content. */
  children: ReactNode;
  /** Composes close behavior onto a single child element. */
  asChild?: boolean;
}
