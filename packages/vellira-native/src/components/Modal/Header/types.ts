import type { BaseModalHeaderProps } from '@romanbakurov/vellira-types';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle } from 'react-native';

import type { NativeComponentProps } from '../../../types';

export interface ModalHeaderProps
  extends BaseModalHeaderProps, NativeComponentProps {
  children: ReactNode;
  textStyle?: StyleProp<TextStyle>;
}
