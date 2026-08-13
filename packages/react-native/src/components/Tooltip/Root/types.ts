import type { BaseTooltipProps, TooltipDelay } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface TooltipRootProps extends Omit<
  BaseTooltipProps,
  'delay' | 'onOpenChange'
> {
  /** Tooltip trigger and content children. */
  children: ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Open delay in milliseconds, or explicit open/close delays. */
  delay?: number | Partial<TooltipDelay>;
  /** Distance between trigger and content in pixels. */
  offset?: number;
  /** Closes the tooltip when pressing outside the content. */
  closeOnOutsidePress?: boolean;
  /** Style applied to the tooltip root container. */
  style?: StyleProp<ViewStyle>;
}
