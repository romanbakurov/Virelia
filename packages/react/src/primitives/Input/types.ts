import type { InputAdornmentTone, InputBaseProps } from '@vellira-ui/types';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export interface InputProps
  extends InputBaseProps, Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  type?: ComponentPropsWithoutRef<'input'>['type'];
  value?: ComponentPropsWithoutRef<'input'>['value'];
  defaultValue?: ComponentPropsWithoutRef<'input'>['defaultValue'];
  onChange?: ComponentPropsWithoutRef<'input'>['onChange'];

  id?: string;
  name?: string;

  leftAdornment?: ReactNode;
  rightAdornment?: ReactNode;
  clearIcon?: ReactNode;

  leftAdornmentTone?: InputAdornmentTone;
  rightAdornmentTone?: InputAdornmentTone;
  clearIconTone?: InputAdornmentTone;

  className?: string;
  autoComplete?: string;
}
