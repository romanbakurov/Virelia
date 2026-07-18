import type {
  BaseSelectMultipleProps,
  BaseSelectOption,
  BaseSelectSingleProps,
} from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type SelectOption = BaseSelectOption;

interface SelectOwnProps {
  label?: string;
  description?: string;
  options: SelectOption[];
  error?: ReactNode;
  style?: StyleProp<ViewStyle>;
  triggerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  pickerStyle?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export type SelectSingleProps = Omit<
  BaseSelectSingleProps,
  'options' | 'error' | 'virtual'
> &
  SelectOwnProps;

export type SelectMultipleProps = Omit<
  BaseSelectMultipleProps,
  'options' | 'error' | 'virtual'
> &
  SelectOwnProps;

export type SelectProps = SelectSingleProps | SelectMultipleProps;
