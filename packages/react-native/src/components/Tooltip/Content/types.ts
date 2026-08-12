import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface TooltipContentProps {
  /** Tooltip content shown while open. */
  children: ReactNode;
  /** Keeps tooltip content mounted when closed. */
  forceMount?: boolean;
  /** Renders a small arrow pointing at the trigger. */
  withArrow?: boolean;
  /** Style applied to the tooltip content container. */
  style?: StyleProp<ViewStyle>;
  /** Style applied to tooltip text. */
  textStyle?: StyleProp<TextStyle>;
}
