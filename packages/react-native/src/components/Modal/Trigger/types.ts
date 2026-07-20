import type { ReactElement, ReactNode } from 'react';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

export type ModalTriggerProps = {
  children: ReactNode;
  asChild?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
} & Pick<PressableProps, 'accessibilityLabel' | 'testID'>;

export type ModalTriggerChildProps = {
  onPress?: PressableProps['onPress'];
  disabled?: boolean;
  accessibilityRole?: PressableProps['accessibilityRole'];
  accessibilityState?: PressableProps['accessibilityState'];
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export type ModalTriggerChild = ReactElement<ModalTriggerChildProps>;
