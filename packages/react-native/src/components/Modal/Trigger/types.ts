import type { ReactElement, ReactNode, Ref } from 'react';
import type { PressableProps, StyleProp, View, ViewStyle } from 'react-native';

export type ModalTriggerProps = {
  children: ReactNode;
  asChild?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
} & Pick<PressableProps, 'accessibilityLabel' | 'testID'>;

export type ModalTriggerChildProps = {
  ref?: Ref<View>;
  onPress?: PressableProps['onPress'];
  disabled?: boolean;
  accessibilityRole?: PressableProps['accessibilityRole'];
  accessibilityState?: PressableProps['accessibilityState'];
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export type ModalTriggerChild = ReactElement<ModalTriggerChildProps>;
