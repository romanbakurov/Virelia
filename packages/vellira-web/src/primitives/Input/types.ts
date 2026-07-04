import type {
  BaseInputProps,
  InputSize,
  InputType,
} from '@romanbakurov/vellira-types';

import type { WebComponentProps } from '../../types';

export type { InputSize, InputType } from '@romanbakurov/vellira-types';

export interface InputProps
  extends
    BaseInputProps,
    WebComponentProps<
      'input',
      | 'children'
      | 'defaultValue'
      | 'disabled'
      | 'onChange'
      | 'required'
      | 'size'
      | 'type'
      | 'value'
    > {
  label: string;
  size?: InputSize;
  error?: string;
  type?: InputType;
  showOverflowTooltip?: boolean;
}
