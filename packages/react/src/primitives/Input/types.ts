import type { BaseInputProps, InputAdornmentTone } from '@vellira-ui/types';
import type { ReactNode } from 'react';

export interface InputProps extends BaseInputProps {
  id?: string;
  name?: string;
  description?: string;

  leftAdornment?: ReactNode;
  rightAdornment?: ReactNode;
  clearIcon?: ReactNode;

  leftAdornmentTone?: InputAdornmentTone;
  rightAdornmentTone?: InputAdornmentTone;

  className?: string;
  autoComplete?: string;
  showOverflowTooltip?: boolean;
}
