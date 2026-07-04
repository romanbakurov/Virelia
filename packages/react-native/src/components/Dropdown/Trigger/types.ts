import type { BaseDropdownTriggerProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface DropdownTriggerProps extends BaseDropdownTriggerProps {
  label: string;
  trigger?: ReactNode;
  icon?: ReactNode;
  arrowIcon?: ReactNode;
  showArrow?: boolean;
  disabled?: boolean;
  triggerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
}
