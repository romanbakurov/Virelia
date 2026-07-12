import type { BaseRadioGroupProps, BaseRadioOption } from '@vellira-ui/types';
import type { HTMLAttributes, ReactNode } from 'react';

export interface RadioOption extends BaseRadioOption {
  label: ReactNode;
  description?: ReactNode;
}

export interface RadioGroupProps
  extends
    Omit<BaseRadioGroupProps, 'options'>,
    Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  label?: ReactNode;
  description?: ReactNode;
  error?: string;
  options?: RadioOption[];
  children?: ReactNode;
}
