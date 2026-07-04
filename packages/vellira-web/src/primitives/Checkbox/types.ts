import type { BaseCheckboxProps } from '@romanbakurov/vellira-types';

import type { WebComponentProps } from '../../types';

export interface CheckboxProps
  extends
    BaseCheckboxProps,
    WebComponentProps<'label', 'children' | 'defaultChecked' | 'onChange'> {
  label?: string;
  error?: string;
}
