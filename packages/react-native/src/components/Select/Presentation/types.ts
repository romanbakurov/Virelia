import type { ReactNode } from 'react';
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';

export type SelectPresentationProps = {
  visible: boolean;
  onClose: () => void;
  dismissOnBackdropPress: boolean;
  layer: number;
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
  onClose: () => void;
  dismissOnBackdropPress: boolean;
};
