import type { BaseDropdownItemProps, TextWrap } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface DropdownItemProps extends Pick<
  BaseDropdownItemProps,
  'label' | 'value' | 'disabled'
> {
  icon?: ReactNode;
  danger?: boolean;
  itemStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onSelect: (value: string) => void;
  textWrap?: TextWrap;
}
