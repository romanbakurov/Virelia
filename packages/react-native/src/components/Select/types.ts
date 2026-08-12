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
  asChild?: boolean;
  children?: ReactNode;
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

export type SelectOption = Omit<SelectItemProps, 'asChild' | 'children'>;

export type SelectIconElement = ReactElement<{
  color?: string;
  size?: number;
}>;

export type SelectRenderOptionContext = {
  option: SelectOption;
  selected: boolean;
  disabled: boolean;
  active: boolean;
  index: number;
  values: string[];
  multiple: boolean;
  pressed: boolean;
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
  context: SelectRenderOptionContext
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
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Placeholder shown in the search field. */
  searchPlaceholder?: string;
  /** Text shown while options are loading. */
  loadingText?: string;
  /** Called when the search query changes. */
  onSearch?: (value: string) => void;
  /** Enables built-in option filtering for the search query. */
  filterOptions?: boolean;
  /** Custom predicate used to filter options for the search query. */
  filter?: (option: SelectOption, query: string) => boolean;
  /** Content shown when no options match the current query. */
  empty?: ReactNode;
  /** Icon rendered before the selected value. */
  startIcon?: SelectIconElement;
  /** Icon rendered after the selected value. */
  endIcon?: SelectIconElement;
  /** Content rendered before the trigger value. */
  prefix?: ReactNode;
  /** Content rendered after the trigger value. */
  suffix?: ReactNode;
  /** Custom renderer for the trigger value. */
  renderValue?: SelectRenderValue;
  /** Custom renderer for each option row. */
  renderOption?: SelectRenderOption;
  /** Presentation mode used for the option overlay. */
  presentation?: SelectPresentation;
  /** Floating placement used by popover presentation. */
  placement?: FloatingPlacement;
  /** Distance between the trigger and floating content. */
  offset?: number;
  /** Matches floating content width to the trigger width. */
  matchTriggerWidth?: boolean;
  /** Allows pressing the backdrop to dismiss the select overlay. */
  dismissOnBackdropPress?: boolean;
  /** Enables virtualized option rendering for large lists. */
  virtual?: boolean | SelectVirtualConfig;
  /** Option data used to populate the native select. */
  options?: SelectOption[];
  /** Custom option elements rendered inside the select. */
  children?: ReactNode;
  /** Style applied to the root container. */
  style?: StyleProp<ViewStyle>;
  /** Style applied to the trigger container. */
  triggerStyle?: StyleProp<ViewStyle>;
  /** Style applied to trigger text. */
  textStyle?: StyleProp<TextStyle>;
  /** Style applied to the overlay content. */
  contentStyle?: StyleProp<ViewStyle>;
  /** Style applied to each option row. */
  optionStyle?: StyleProp<ViewStyle>;
  /** Style applied to the search input. */
  searchStyle?: StyleProp<TextStyle>;
  /** Accessible name announced by screen readers. */
  accessibilityLabel?: string;
  /** Additional accessibility hint for the select trigger. */
  accessibilityHint?: string;
  /** Test identifier forwarded to the native control. */
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
