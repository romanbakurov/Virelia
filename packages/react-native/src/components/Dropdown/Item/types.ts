import type { BaseDropdownItemProps, TextWrap } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface DropdownItemProps extends Pick<
  BaseDropdownItemProps,
  'value' | 'disabled'
> {
  label: ReactNode;
  icon?: ReactNode;
  danger?: boolean;
  itemStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onSelect: (value: string) => void;
  textWrap?: TextWrap;
}
