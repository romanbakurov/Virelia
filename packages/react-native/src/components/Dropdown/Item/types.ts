import type { TextWrap } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import type { DropdownColor } from '../types';

export interface DropdownItemProps {
  value: string;
  color?: DropdownColor;
  disabled?: boolean;
  label: ReactNode;
  icon?: ReactNode;
  danger?: boolean;
  itemStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onSelect: (value: string) => void;
  textWrap?: TextWrap;
}
