import type { FloatingPlacement, TooltipDelay } from '@vellira-ui/types';
import type { RefObject } from 'react';
import type { LayoutChangeEvent, View } from 'react-native';

export type NativeTooltipDelay = Partial<TooltipDelay>;

export type TooltipContextValue = {
  contentId: string;
  open: boolean;
  disabled: boolean;
  placement: FloatingPlacement;
  position: {
    top: number;
    left: number;
  };
  arrowPosition: {
    top?: number;
    left?: number;
  };
  triggerRef: RefObject<View | null>;
  setOpen: (open: boolean) => void;
  show: () => void;
  hide: () => void;
  requestClose: () => void;
  requestOutsideClose: () => void;
  onFloatingLayout: (event: LayoutChangeEvent) => void;
};
