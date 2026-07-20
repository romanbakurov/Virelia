import type { ReactElement } from 'react';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

export type ModalCloseProps = {
  children?: ReactElement<{
    onPress?: PressableProps['onPress'];
    accessibilityLabel?: string;
  }>;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};
