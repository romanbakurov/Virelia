import type { ReactNode } from 'react';
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';

import type { OverlayOutsidePressProps } from '../../../hooks';

export type SelectPresentationProps = {
  visible: boolean;
  onClose: () => void;
  outsidePressProps: OverlayOutsidePressProps;
  zIndex: number;
  contentStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export type SelectPopoverProps = SelectPresentationProps & {
  position: {
    top: number;
    left: number;
  };
  onFloatingLayout: (event: LayoutChangeEvent) => void;
  matchTriggerWidth: boolean;
  triggerWidth?: number;
};

export type SelectBackdropProps = {
  outsidePressProps: OverlayOutsidePressProps;
};
