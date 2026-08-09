import type { BaseModalHeaderProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface ModalHeaderProps extends BaseModalHeaderProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export interface ModalTitleProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

export interface ModalDescriptionProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}
