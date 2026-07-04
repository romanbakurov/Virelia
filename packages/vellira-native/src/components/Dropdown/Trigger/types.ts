import type { BaseDropdownTriggerProps } from '@romanbakurov/vellira-types';
import type { ReactNode } from 'react';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

export interface DropdownTriggerProps
  extends
    BaseDropdownTriggerProps,
    Omit<PressableProps, 'children' | 'disabled' | 'onPress' | 'style'> {
  label: string;
  trigger?: ReactNode;
  icon?: ReactNode;
  arrowIcon?: ReactNode;
  showArrow?: boolean;
  disabled?: boolean;
  triggerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
}
