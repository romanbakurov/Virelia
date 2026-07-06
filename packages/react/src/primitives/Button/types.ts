import type { BaseButtonProps } from '@vellira-ui/types';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps
  extends
    BaseButtonProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  ariaLabel?: string | false;
  children?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}
