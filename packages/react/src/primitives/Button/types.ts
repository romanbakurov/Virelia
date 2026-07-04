import type { BaseButtonProps } from '@vellira-ui/types';
import type { MouseEventHandler, ReactNode } from 'react';

export interface ButtonProps extends BaseButtonProps {
  ariaLabel?: string | false;
  children?: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}
