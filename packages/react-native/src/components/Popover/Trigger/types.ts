import type { ReactElement, Ref } from 'react';
import type { GestureResponderEvent, PressableProps, View } from 'react-native';

export interface PopoverTriggerChildProps {
  ref?: Ref<View>;
  onPress?: (event: GestureResponderEvent) => void;
}

export interface PopoverTriggerProps extends Omit<PressableProps, 'children'> {
  children: ReactElement<PopoverTriggerChildProps>;
  asChild?: boolean;
}
