import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';

export interface PopoverTriggerProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  children: ReactNode;
  asChild?: boolean;
}

export type PopoverTriggerChildProps = HTMLAttributes<HTMLElement> & {
  disabled?: boolean;
  ref?: Ref<HTMLElement>;
};

export type PopoverTriggerChild = ReactElement<PopoverTriggerChildProps>;
