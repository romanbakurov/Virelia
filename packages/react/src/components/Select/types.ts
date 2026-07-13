import type { Placement } from '@floating-ui/react';
import type { BaseSelectOption, BaseSelectProps } from '@vellira-ui/types';
import type { FocusEventHandler, ReactNode } from 'react';

export type SelectOption = BaseSelectOption;

export interface SelectProps extends Omit<
  BaseSelectProps,
  'options' | 'label' | 'description' | 'error'
> {
  label?: ReactNode;
  description?: ReactNode;
  id?: string;
  name?: string;
  'aria-label'?: string;
  options: SelectOption[];
  error?: ReactNode;
  noOptionsText?: ReactNode;
  placement?: Extract<
    Placement,
    'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  >;
  matchTriggerWidth?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
}
