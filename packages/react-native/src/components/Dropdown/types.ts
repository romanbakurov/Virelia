import type { BaseDropdownProps, TextWrap } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type DropdownPresentation = 'auto' | 'sheet' | 'modal' | 'popover';

export type DropdownSelectEvent = {
  preventDefault: () => void;
  defaultPrevented: boolean;
};

export interface DropdownProps extends Omit<
  BaseDropdownProps,
  'items' | 'onSelect'
> {
  children?: ReactNode;
  label?: ReactNode;

  trigger?: ReactNode;
  icon?: ReactNode;
  arrowIcon?: ReactNode;
  showArrow?: boolean;

  presentation?: DropdownPresentation;
  closeOnSelect?: boolean;
  loading?: boolean;
  loadingText?: ReactNode;

  style?: StyleProp<ViewStyle>;
  triggerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;

  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export interface DropdownTriggerProps {
  children?: ReactNode;
  disabled?: boolean;
}

export interface DropdownContentProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  presentation?: DropdownPresentation;
}

export interface DropdownItemProps {
  children: ReactNode;
  value?: string;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  closeOnSelect?: boolean;
  textWrap?: TextWrap;
  onSelect?: (event: DropdownSelectEvent) => void;
}

export interface DropdownGroupProps {
  children?: ReactNode;
}

export interface DropdownLabelProps {
  children?: ReactNode;
}

export type DropdownSeparatorProps = object;

export interface DropdownEmptyProps {
  children?: ReactNode;
}

export interface DropdownLoadingProps {
  children?: ReactNode;
}
