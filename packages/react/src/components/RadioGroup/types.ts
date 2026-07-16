import type { BaseRadioGroupProps, RadioColor } from '@vellira-ui/types';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface RadioGroupProps
  extends
    BaseRadioGroupProps,
    Omit<
      ComponentPropsWithoutRef<'div'>,
      'color' | 'defaultValue' | 'onChange' | 'role'
    > {
  name?: string;
  label?: ReactNode;
  children?: ReactNode;
  description?: ReactNode;
  error?: string;
  /** Selected color inherited by child radios. */
  color?: RadioColor;
}
