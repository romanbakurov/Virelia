import type { BaseTabProps } from '@romanbakurov/vellira-types';
import type { ReactNode } from 'react';
import type {
  PressableProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

export interface TabProps
  extends
    BaseTabProps,
    Omit<PressableProps, 'children' | 'disabled' | 'onPress' | 'style'> {
  children?: ReactNode;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}
