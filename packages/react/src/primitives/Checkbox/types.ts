import type { BaseCheckboxProps } from '@vellira-ui/types';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface CheckboxProps
  extends
    BaseCheckboxProps,
    Omit<
      ComponentPropsWithoutRef<'input'>,
      'size' | 'color' | 'checked' | 'defaultChecked' | 'onChange' | 'type'
    > {
  /** Visible label rendered next to the control. */
  label?: ReactNode;
  /** Helper text rendered below the checkbox row. */
  description?: ReactNode;
  /** Icon rendered for the checked state. */
  icon?: ReactNode;
  /** Icon rendered for the indeterminate state. */
  indeterminateIcon?: ReactNode;
  /** Selected checkbox color. */
  color?: BaseCheckboxProps['color'];
  /** Position of the visible label relative to the checkbox. */
  labelPosition?: BaseCheckboxProps['labelPosition'];
  /** Extra CSS class for the clickable label wrapper. */
  wrapperClassName?: string;
}
