import type { BaseInputProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';

export interface InputProps extends BaseInputProps {
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
