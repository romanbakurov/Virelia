import type { TextWrap } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type DropdownPresentation = 'auto' | 'sheet' | 'modal' | 'popover';
export type DropdownSize = 'sm' | 'md' | 'lg';
export type DropdownColor =
  'primary' | 'neutral' | 'success' | 'warning' | 'danger';
export type DropdownItemColor =
  'default' | 'primary' | 'success' | 'warning' | 'danger';

export type DropdownSelectEvent = {
  preventDefault: () => void;
  defaultPrevented: boolean;
};

export interface DropdownProps {
  children?: ReactNode;
  label?: ReactNode;

  trigger?: ReactNode;
  icon?: ReactNode;
  arrowIcon?: ReactNode;
  showArrow?: boolean;

  presentation?: DropdownPresentation;
  closeOnSelect?: boolean;
  /** Semantic palette for trigger, content, focus, and pressed item states. */
  color?: DropdownColor;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: ReactNode;
  size?: DropdownSize;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  searchable?: boolean;
  command?: boolean;
  searchValue?: string;
  defaultSearchValue?: string;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  empty?: ReactNode;

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
  command?: boolean;
  style?: StyleProp<ViewStyle>;
  presentation?: DropdownPresentation;
}

export interface DropdownSearchProps {
  placeholder?: string;
  accessibilityLabel?: string;
}

export interface DropdownItemProps {
  children: ReactNode;
  value?: string;
  icon?: ReactNode;
  /** Semantic item color. Use `danger` for destructive actions. */
  color?: DropdownItemColor;
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
