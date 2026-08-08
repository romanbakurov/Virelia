import type {
  BasePopoverPositioningProps,
  FloatingPlacement,
  PopoverOpenChangeDetails,
} from '@vellira-ui/types';
import type { MutableRefObject } from 'react';
import type { LayoutChangeEvent, View, ViewStyle } from 'react-native';

export interface PopoverContextValue {
  open: boolean;
  closeOnOutsidePress: boolean;

  triggerRef: MutableRefObject<View | null>;
  anchorRef: MutableRefObject<View | null>;

  side: NonNullable<BasePopoverPositioningProps['side']>;
  align: NonNullable<BasePopoverPositioningProps['align']>;

  placement: FloatingPlacement;
  layer: number;
  position: Pick<ViewStyle, 'top' | 'left'>;
  arrowPosition: Pick<ViewStyle, 'top' | 'left'>;

  onFloatingLayout: (event: LayoutChangeEvent) => void;
  updatePosition: (containerRef?: MutableRefObject<View | null>) => void;

  setOpen: (open: boolean, details: PopoverOpenChangeDetails) => void;

  requestClose: () => void;
  requestOutsideClose: () => void;
}
