import type {
  BasePopoverPositioningProps,
  BasePopoverProps,
} from '@vellira-ui/types';
import type { ReactNode } from 'react';

export interface PopoverProps
  extends BasePopoverProps, BasePopoverPositioningProps {
  children: ReactNode;
  portal?: boolean;
  strategy?: 'absolute' | 'fixed';
}
