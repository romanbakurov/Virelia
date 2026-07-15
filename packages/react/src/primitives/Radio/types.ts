import type { BaseRadioProps } from '@vellira-ui/types';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface RadioProps
  extends
    BaseRadioProps,
    Omit<
      ComponentPropsWithoutRef<'input'>,
      | 'type'
      | 'value'
      | 'checked'
      | 'defaultChecked'
      | 'disabled'
      | 'required'
      | 'onChange'
      | 'size'
    > {
  label?: ReactNode;
  description?: ReactNode;
  wrapperClassName?: string;
}
