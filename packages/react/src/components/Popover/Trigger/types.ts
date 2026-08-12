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
  /** Trigger content. */
  children: ReactNode;
  /** Composes trigger behavior onto a single child element. */
  asChild?: boolean;
}

export type PopoverTriggerChildProps = HTMLAttributes<HTMLElement> & {
  /** Disables trigger interaction on the composed child. */
  disabled?: boolean;
  /** Ref forwarded to the composed trigger child. */
  ref?: Ref<HTMLElement>;
};

export type PopoverTriggerChild = ReactElement<PopoverTriggerChildProps>;
