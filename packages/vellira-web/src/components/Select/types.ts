import type {
  BaseSelectOption,
  BaseSelectProps,
} from '@romanbakurov/vellira-types';

import type { WebComponentProps } from '../../types';

export type { SelectSize } from '@romanbakurov/vellira-types';

export interface SelectOption extends BaseSelectOption {
  label: string;
}

export interface SelectProps
  extends
    Omit<BaseSelectProps, 'options'>,
    WebComponentProps<
      'button',
      | 'children'
      | 'defaultValue'
      | 'disabled'
      | 'onChange'
      | 'required'
      | 'size'
      | 'value'
    > {
  label?: string;
  description?: string;
  name?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}
