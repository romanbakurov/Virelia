import type { BaseModalHeaderProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface ModalHeaderProps extends BaseModalHeaderProps {
  /** Header content, typically title and description. */
  children: ReactNode;
  /** Style applied to the header container. */
  style?: StyleProp<ViewStyle>;
  /** Style applied to header text when rendered by the component. */
  textStyle?: StyleProp<TextStyle>;
}

export interface ModalTitleProps {
  /** Title content. */
  children: ReactNode;
  /** Style applied to the title text. */
  style?: StyleProp<TextStyle>;
}

export interface ModalDescriptionProps {
  /** Description content. */
  children: ReactNode;
  /** Style applied to the description text. */
  style?: StyleProp<TextStyle>;
}
