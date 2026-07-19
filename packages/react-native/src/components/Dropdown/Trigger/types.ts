import type { BaseDropdownTriggerProps, DropdownSize } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface DropdownTriggerProps extends BaseDropdownTriggerProps {
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
