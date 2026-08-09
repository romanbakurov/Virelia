import type { DropdownItemColor, TextWrap } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface DropdownItemProps {
  value: string;
  asChild?: boolean;
  children?: ReactNode;
  color?: DropdownItemColor;
  disabled?: boolean;
  label: ReactNode;
  icon?: ReactNode;
  textWrap?: TextWrap;
  onSelect: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}
