import type { BaseModalContentProps } from '@romanbakurov/vellira-types';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { NativeComponentProps } from '../../../types';

export interface ModalContentProps
  extends BaseModalContentProps, NativeComponentProps {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
}
