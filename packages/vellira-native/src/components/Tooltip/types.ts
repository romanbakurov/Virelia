import type { BaseTooltipProps } from '@romanbakurov/vellira-types';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import type { NativeComponentProps } from '../../types';

export interface TooltipProps extends BaseTooltipProps, NativeComponentProps {
  content: ReactNode;
  children: ReactNode;
  maxWidth?: number;
  contentStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}
