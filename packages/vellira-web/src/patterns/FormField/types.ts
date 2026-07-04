import type { BaseFormFieldProps } from '@romanbakurov/vellira-types';
import type { ReactNode } from 'react';

import type { WebComponentProps } from '../../types';

export interface FormFieldProps
  extends BaseFormFieldProps, WebComponentProps<'div', 'children'> {
  label?: string;
  description?: string;
  error?: string;
  children: ReactNode;
}
