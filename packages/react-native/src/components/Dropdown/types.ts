import type {
  BaseDropdownContentProps,
  BaseDropdownItemProps,
  BaseDropdownProps,
  BaseDropdownSearchProps,
  BaseDropdownTriggerProps,
  FloatingPlacement,
  TextWrap,
} from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type DropdownPresentation = 'auto' | 'sheet' | 'modal' | 'popover';

export type DropdownSelectEvent = {
  preventDefault: () => void;
  defaultPrevented: boolean;
};

export interface DropdownProps extends BaseDropdownProps {
  children?: ReactNode;
  label?: ReactNode;

  trigger?: ReactNode;
  icon?: ReactNode;
  arrowIcon?: ReactNode;
  showArrow?: boolean;

  presentation?: DropdownPresentation;
  placement?: FloatingPlacement;
  offset?: number;
  loadingText?: ReactNode;
  empty?: ReactNode;

  style?: StyleProp<ViewStyle>;
  triggerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;

  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export interface DropdownTriggerProps extends BaseDropdownTriggerProps {
  children?: ReactNode;
}

export interface DropdownContentProps extends BaseDropdownContentProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  presentation?: DropdownPresentation;
}

export interface DropdownSearchProps extends BaseDropdownSearchProps {
  accessibilityLabel?: string;
}

export interface DropdownItemProps extends BaseDropdownItemProps {
  children: ReactNode;
  asChild?: boolean;
  value?: string;
  icon?: ReactNode;
  textWrap?: TextWrap;
  onSelect?: (event: DropdownSelectEvent) => void;
}

export type DropdownSeparatorProps = object;

export interface DropdownGroupProps {
  children?: ReactNode;
}

export interface DropdownLabelProps {
  children?: ReactNode;
}

export interface DropdownEmptyProps {
  children?: ReactNode;
}

export interface DropdownLoadingProps {
  children?: ReactNode;
}
