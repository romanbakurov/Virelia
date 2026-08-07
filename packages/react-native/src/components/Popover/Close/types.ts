import type { ReactElement } from 'react';
import type { GestureResponderEvent, PressableProps } from 'react-native';

export interface PopoverCloseChildProps {
  onPress?: (event: GestureResponderEvent) => void;
}

export interface PopoverCloseProps extends Omit<PressableProps, 'children'> {
  children: ReactElement<PopoverCloseChildProps>;
  asChild?: boolean;
}
