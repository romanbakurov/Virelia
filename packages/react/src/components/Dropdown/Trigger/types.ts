import type { BaseDropdownTriggerProps, DropdownSize } from '@vellira-ui/types';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface DropdownTriggerProps
  extends
    BaseDropdownTriggerProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'disabled'> {
  children?: ReactNode;
  label?: ReactNode;
  ariaLabel?: string;

  icon?: ReactNode;
  arrowIcon?: ReactNode;

  disabled?: boolean;
  size?: DropdownSize;
  showArrow?: boolean;
  rotateAngle?: number;
}
