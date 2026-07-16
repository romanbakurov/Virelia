import type { BaseRadioProps, RadioColor } from '@vellira-ui/types';
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
      | 'color'
    > {
  /** Visible label rendered next to the control. */
  label?: ReactNode;
  /** Helper text rendered below the label. */
  description?: ReactNode;
  /** Custom indicator rendered for the checked state. */
  icon?: ReactNode;
  /** Selected radio color. */
  color?: RadioColor;
  /** Extra CSS class for the clickable label wrapper. */
  wrapperClassName?: string;
}
