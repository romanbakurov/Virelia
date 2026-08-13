import type {
  BasePopoverPositioningProps,
  BasePopoverProps,
} from '@vellira-ui/types';
import type { ReactNode } from 'react';

export interface PopoverProps
  extends BasePopoverProps, BasePopoverPositioningProps {
  /** Popover trigger, anchor, content, and compound children. */
  children: ReactNode;
  /** Closes the popover when pressing outside the content. */
  closeOnOutsidePress?: boolean;
}
