import type { ReactElement, Ref } from 'react';
import type { View, ViewProps } from 'react-native';

export interface PopoverAnchorChildProps {
  /** Ref forwarded to the anchor child for measurement. */
  ref?: Ref<View>;
}

export interface PopoverAnchorProps extends Omit<ViewProps, 'children'> {
  /** Element used as the positioning anchor. */
  children: ReactElement<PopoverAnchorChildProps>;
  /** Composes anchor behavior onto a single child element. */
  asChild?: boolean;
}
