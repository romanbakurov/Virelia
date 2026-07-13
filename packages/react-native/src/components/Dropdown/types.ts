import type {
  BaseDropdownGroup,
  BaseDropdownMenuItem,
  BaseDropdownProps,
  BaseDropdownSeparator,
  TextWrap,
} from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface DropdownMenuItem extends Omit<BaseDropdownMenuItem, 'label'> {
  label: ReactNode;
  icon?: ReactNode;
  textWrap?: TextWrap;
}

export interface DropdownGroup extends Omit<BaseDropdownGroup, 'label'> {
  label: ReactNode;
}

export type DropdownSeparator = BaseDropdownSeparator;

export type DropdownItem = DropdownMenuItem | DropdownGroup | DropdownSeparator;

export interface DropdownProps extends Omit<BaseDropdownProps, 'items'> {
  label?: ReactNode;

  trigger?: ReactNode;
  icon?: ReactNode;
  arrowIcon?: ReactNode;
  showArrow?: boolean;

  items: DropdownItem[];

  style?: StyleProp<ViewStyle>;
  triggerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;

  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const isMenuItem = (item: DropdownItem): item is DropdownMenuItem =>
  item.type === undefined || item.type === 'item';

export const isGroup = (item: DropdownItem): item is DropdownGroup =>
  item.type === 'group';

export const isSeparator = (item: DropdownItem): item is DropdownSeparator =>
  item.type === 'separator';
