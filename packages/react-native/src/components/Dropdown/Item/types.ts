import type { TextWrap } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import type { DropdownColor, DropdownItemColor } from '../types';

export interface DropdownItemProps {
  value: string;
  rootColor?: DropdownColor;
  color?: DropdownItemColor;
  disabled?: boolean;
  label: ReactNode;
  icon?: ReactNode;
  itemStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onSelect: (value: string) => void;
  textWrap?: TextWrap;
}
