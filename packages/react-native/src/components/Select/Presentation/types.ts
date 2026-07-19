import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type SelectPresentationProps = {
  visible: boolean;
  onClose: () => void;
  dismissOnBackdropPress: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export type SelectPopoverProps = SelectPresentationProps & {
  placement: 'top' | 'bottom';
  matchTriggerWidth: boolean;
  triggerWidth?: number;
};

export type SelectBackdropProps = {
  onClose: () => void;
  dismissOnBackdropPress: boolean;
};
