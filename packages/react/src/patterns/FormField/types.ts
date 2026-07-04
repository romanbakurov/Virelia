import type { BaseFormFieldProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';

export interface FormFieldProps extends BaseFormFieldProps {
  id?: string;
  label?: string;
  description?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}
