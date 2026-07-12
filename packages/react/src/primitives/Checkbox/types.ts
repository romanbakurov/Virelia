import type { BaseCheckboxProps } from '@vellira-ui/types';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface CheckboxProps
  extends
    BaseCheckboxProps,
    Omit<
      ComponentPropsWithoutRef<'input'>,
      'size' | 'checked' | 'defaultChecked' | 'onChange' | 'type'
    > {
  label?: ReactNode;
  description?: ReactNode;
  wrapperClassName?: string;
}
