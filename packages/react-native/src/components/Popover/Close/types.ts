import type { ReactElement } from 'react';
import type { GestureResponderEvent, PressableProps } from 'react-native';

export interface PopoverCloseChildProps {
  /** Press handler injected into the composed close child. */
  onPress?: (event: GestureResponderEvent) => void;
}

export interface PopoverCloseProps extends Omit<PressableProps, 'children'> {
  /** Close button element. */
  children: ReactElement<PopoverCloseChildProps>;
  /** Composes close behavior onto a single child element. */
  asChild?: boolean;
}
