import type {
  BaseSelectOption,
  BaseSelectSharedProps,
  FloatingPlacement,
} from '@vellira-ui/types';
import type { ReactElement, ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type SelectPresentation = 'auto' | 'sheet' | 'modal' | 'popover';

export type SelectVirtualConfig = {
  estimatedItemSize?: number;
  initialNumToRender?: number;
  windowSize?: number;
};

export type SelectItemProps = Omit<
  BaseSelectOption,
  'badge' | 'icon' | 'shortcut'
> & {
  disabled?: boolean;
  icon?: ReactNode;
  badge?: ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

export type SelectItemIconProps = {
  children?: ReactNode;
};

export type SelectItemDescriptionProps = {
  children?: ReactNode;
};

export type SelectItemBadgeProps = {
  children?: ReactNode;
};

export type SelectOption = SelectItemProps;

export type SelectIconElement = ReactElement<{
  color?: string;
  size?: number;
}>;

export type SelectRenderOptionState = {
  selected: boolean;
  disabled: boolean;
};

export type SelectRenderValueContext = {
  option: SelectOption | undefined;
  options: SelectOption[];
  value: string;
  values: string[];
  placeholder: string;
  multiple: boolean;
};

export type SelectRenderOption = (
  option: SelectOption,
  state: SelectRenderOptionState
) => ReactNode;

export type SelectRenderValue = (
  context: SelectRenderValueContext
) => ReactNode;

type SelectSharedBaseProps = Pick<
  BaseSelectSharedProps,
  | 'placeholder'
  | 'size'
  | 'color'
  | 'variant'
  | 'invalid'
  | 'required'
  | 'disabled'
  | 'loading'
  | 'clearable'
  | 'searchable'
  | 'maxSelected'
  | 'closeOnSelect'
>;

type SelectSharedProps = SelectSharedBaseProps & {
  label?: string;
  description?: string;
  error?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  searchPlaceholder?: string;
  loadingText?: string;
  onSearch?: (value: string) => void;
  filterOptions?: boolean;
  filter?: (option: SelectOption, query: string) => boolean;
  empty?: ReactNode;
  startIcon?: SelectIconElement;
  endIcon?: SelectIconElement;
  prefix?: ReactNode;
  suffix?: ReactNode;
  renderValue?: SelectRenderValue;
  renderOption?: SelectRenderOption;
  presentation?: SelectPresentation;
  placement?: FloatingPlacement;
  offset?: number;
  matchTriggerWidth?: boolean;
  dismissOnBackdropPress?: boolean;
  virtual?: boolean | SelectVirtualConfig;
  options?: SelectOption[];
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  triggerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  optionStyle?: StyleProp<ViewStyle>;
  searchStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
};

export type SelectSingleProps = SelectSharedProps & {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
};

export type SelectMultipleProps = SelectSharedProps & {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type SelectProps = SelectSingleProps | SelectMultipleProps;

export type SelectTriggerSlotProps = {
  children?: ReactNode;
};

export type SelectValueSlotProps = {
  children?: ReactNode;
};

export type SelectIconSlotProps = {
  children?: ReactNode;
};

export type SelectContentProps = {
  children?: ReactNode;
};

export type SelectSearchProps = {
  placeholder?: string;
};

export type SelectGroupProps = {
  label?: string;
  selectable?: boolean;
  selectLabel?: string;
  children?: ReactNode;
};

export type SelectLabelProps = {
  children?: ReactNode;
};

export type SelectSeparatorProps = Record<string, never>;

export type SelectEmptyProps = {
  children?: ReactNode;
};

export type SelectLoadingProps = {
  children?: ReactNode;
};
