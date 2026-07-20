import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';

export interface TooltipTriggerProps extends HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  children: ReactNode;
  disabled?: boolean;
}

export type TooltipTriggerElement = ReactElement<
  HTMLAttributes<HTMLElement> & {
    disabled?: boolean;
    ref?: Ref<HTMLElement>;
  }
>;
