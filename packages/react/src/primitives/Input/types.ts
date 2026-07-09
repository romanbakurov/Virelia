import type { BaseInputVisualProps } from '@vellira-ui/types';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface InputProps
  extends
    BaseInputVisualProps,
    Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  type?: ComponentPropsWithoutRef<'input'>['type'];
  value?: ComponentPropsWithoutRef<'input'>['value'];
  defaultValue?: ComponentPropsWithoutRef<'input'>['defaultValue'];
  onChange?: ComponentPropsWithoutRef<'input'>['onChange'];

  id?: string;
  name?: string;
  description?: string;

  leftAdornment?: ReactNode;
  rightAdornment?: ReactNode;
  clearIcon?: ReactNode;

  className?: string;
  autoComplete?: string;
  showOverflowTooltip?: boolean;
}
