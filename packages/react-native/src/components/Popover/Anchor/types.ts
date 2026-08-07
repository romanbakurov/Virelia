import type { ReactElement, Ref } from 'react';
import type { View, ViewProps } from 'react-native';

export interface PopoverAnchorChildProps {
  ref?: Ref<View>;
}

export interface PopoverAnchorProps extends Omit<ViewProps, 'children'> {
  children: ReactElement<PopoverAnchorChildProps>;
  asChild?: boolean;
}
