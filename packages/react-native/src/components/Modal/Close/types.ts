import type { ReactElement } from 'react';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

export type ModalCloseProps = {
  /** Composes close behavior onto a single child element. */
  asChild?: boolean;
  /** Custom close button element. */
  children?: ReactElement<{
    onPress?: PressableProps['onPress'];
    accessibilityLabel?: string;
  }>;
  /** Accessible name for the close button. */
  accessibilityLabel?: string;
  /** Style applied to the close button. */
  style?: StyleProp<ViewStyle>;
};
