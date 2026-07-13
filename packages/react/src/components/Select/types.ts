import type { Placement } from '@floating-ui/react';
import type { BaseSelectOption, BaseSelectProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';

export type SelectOption = BaseSelectOption;

export interface SelectProps extends Omit<
  BaseSelectProps,
  'options' | 'label' | 'description' | 'error'
> {
  label?: ReactNode;
  description?: ReactNode;
  id?: string;
  name?: string;
  options: SelectOption[];
  error?: ReactNode;
  placement?: Extract<
    Placement,
    'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  >;
  matchTriggerWidth?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
}
