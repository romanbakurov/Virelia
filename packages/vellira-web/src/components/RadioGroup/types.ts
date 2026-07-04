import type {
  BaseRadioGroupProps,
  BaseRadioOption,
  Orientation,
} from '@romanbakurov/vellira-types';

import type { WebComponentProps } from '../../types';

export interface RadioOption extends BaseRadioOption {
  label: string;
}

export interface RadioGroupProps
  extends
    Omit<BaseRadioGroupProps, 'options'>,
    WebComponentProps<'div', 'children' | 'defaultValue' | 'onChange'> {
  label?: string;
  description?: string;
  name?: string;
  options: RadioOption[];
  error?: string;
  orientation?: Orientation;
}
