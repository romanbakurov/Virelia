import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface DropdownTriggerProps {
  asChild?: boolean;
  label?: ReactNode;
  trigger?: ReactNode;
  children?: ReactNode;
  icon?: ReactNode;
  arrowIcon?: ReactNode;
  showArrow?: boolean;

  accessibilityLabel?: string;
  accessibilityHint?: string;

  triggerStyle?: StyleProp<ViewStyle>;
  triggerRef?: (node: unknown) => void;
}
