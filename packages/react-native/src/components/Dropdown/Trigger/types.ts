import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type { DropdownColor, DropdownSize } from '../types';

export interface DropdownTriggerProps {
  asChild?: boolean;
  isOpen: boolean;
  color?: DropdownColor;
  label?: ReactNode;
  trigger?: ReactNode;
  children?: ReactNode;
  icon?: ReactNode;
  arrowIcon?: ReactNode;

  disabled?: boolean;
  size?: DropdownSize;
  showArrow?: boolean;

  accessibilityLabel?: string;
  accessibilityHint?: string;

  triggerStyle?: StyleProp<ViewStyle>;
  triggerRef?: (node: unknown) => void;
  onPress: () => void;
}
