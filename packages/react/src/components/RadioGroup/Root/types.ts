import type { BaseRadioGroupProps, RadioColor } from '@vellira-ui/types';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface RadioGroupProps
  extends
    BaseRadioGroupProps,
    Omit<
      ComponentPropsWithoutRef<'div'>,
      'color' | 'defaultValue' | 'onChange' | 'role'
    > {
  /** Native radio group name shared by child radios. */
  name?: string;
  /** Visible group label. */
  label?: ReactNode;
  /** Radio item children. */
  children?: ReactNode;
  /** Supporting text rendered with the group. */
  description?: ReactNode;
  /** Validation error rendered for invalid state. */
  error?: string;
  /** Selected color inherited by child radios. */
  color?: RadioColor;
}
