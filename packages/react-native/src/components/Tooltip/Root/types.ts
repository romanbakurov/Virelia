import type { BaseTooltipProps, TooltipDelay } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface TooltipRootProps extends Omit<
  BaseTooltipProps,
  'delay' | 'onOpenChange'
> {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delay?: number | Partial<TooltipDelay>;
  offset?: number;
  closeOnOutsidePress?: boolean;
  style?: StyleProp<ViewStyle>;
}
