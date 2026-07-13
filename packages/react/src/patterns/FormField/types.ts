import type { BaseFormFieldProps } from '@vellira-ui/types';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface FormFieldProps
  extends
    Omit<BaseFormFieldProps, 'label' | 'description' | 'error'>,
    Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'id'> {
  id?: string;

  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  children: ReactNode;

  controlClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
}
