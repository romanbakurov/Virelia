import type { ReactNode } from 'react';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

export interface TooltipTriggerProps extends Omit<
  PressableProps,
  'children' | 'disabled' | 'style'
> {
  /** Trigger content. */
  children: ReactNode;
  /** Disables tooltip interaction for this trigger. */
  disabled?: boolean;
  /** Style applied to the trigger container. */
  style?: StyleProp<ViewStyle>;
}
