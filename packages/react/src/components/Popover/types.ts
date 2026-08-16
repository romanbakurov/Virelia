import type {
  BasePopoverPositioningProps,
  BasePopoverProps,
} from '@vellira-ui/types';
import type { ReactNode } from 'react';

export interface PopoverProps
  extends
    BasePopoverProps,
    Omit<BasePopoverPositioningProps, 'alignOffset' | 'hideWhenDetached'> {
  /** Popover trigger, anchor, content, and compound children. */
  children: ReactNode;
  /** Renders popover content through a portal. */
  portal?: boolean;
  /** CSS positioning strategy used by floating content. */
  strategy?: 'absolute' | 'fixed';
}
