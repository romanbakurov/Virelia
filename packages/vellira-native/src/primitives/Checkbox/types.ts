import type { BaseCheckboxProps } from '@romanbakurov/vellira-types';
import type { PressableProps } from 'react-native';

import type { NativeComponentProps } from '../../types';

export interface CheckboxProps
  extends
    BaseCheckboxProps,
    NativeComponentProps,
    Omit<
      PressableProps,
      'children' | 'disabled' | 'onPress' | 'style' | 'testID'
    > {
  label?: string;
  error?: string;
}
