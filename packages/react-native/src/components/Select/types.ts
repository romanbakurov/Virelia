import type {
  BaseSelectOption,
  BaseSelectSharedProps,
  FloatingPlacement,
} from '@vellira-ui/types';
import type { ReactElement, ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export type SelectPresentation = 'auto' | 'sheet' | 'modal' | 'popover';

export type SelectVirtualConfig = {
  /** Estimated row height used by the native virtualized list. */
  estimatedItemSize?: number;
  /** Number of items rendered during the initial list mount. */
  initialNumToRender?: number;
  /** Number of viewport heights kept rendered around the visible area. */
  windowSize?: number;
};

export type SelectItemProps = Omit<
  BaseSelectOption,
  'badge' | 'icon' | 'shortcut'
> & {
  /** Composes item behavior onto a single child element. */
  asChild?: boolean;
  /** Option label or custom option content. */
  children?: ReactNode;
  /** Disables selection for this option. */
  disabled?: boolean;
  /** Icon shown before the option label. */
  icon?: ReactNode;
  /** Badge content shown after the option label. */
  badge?: ReactNode;
  /** Accessible name announced for this option. */
  accessibilityLabel?: string;
  /** Additional accessibility hint for this option. */
  accessibilityHint?: string;
};

export type SelectItemIconProps = {
  /** Icon content for a select item. */
  children?: ReactNode;
};

export type SelectItemDescriptionProps = {
  /** Supporting description content for a select item. */
  children?: ReactNode;
};

export type SelectItemBadgeProps = {
  /** Badge content for a select item. */
  children?: ReactNode;
};

export type SelectOption = Omit<SelectItemProps, 'asChild' | 'children'>;

export type SelectIconElement = ReactElement<{
  color?: string;
  size?: number;
}>;

export type SelectRenderOptionContext = {
  /** Option being rendered. */
  option: SelectOption;
  /** Whether the option is selected. */
  selected: boolean;
  /** Whether the option is disabled. */
  disabled: boolean;
  /** Whether the option is the active item. */
  active: boolean;
  /** Zero-based option index. */
  index: number;
  /** Current selected values. */
  values: string[];
  /** Whether multiple selection is enabled. */
  multiple: boolean;
  /** Whether the option row is currently pressed. */
  pressed: boolean;
};

export type SelectRenderValueContext = {
  /** Selected option for single selection, or the first selected option for multiple selection. */
  option: SelectOption | undefined;
  /** All options available to the select. */
  options: SelectOption[];
  /** Current selected value for single selection. */
  value: string;
  /** Current selected values. */
  values: string[];
  /** Placeholder text used when no value is selected. */
  placeholder: string;
  /** Whether multiple selection is enabled. */
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
  /** Enables single-selection mode. */
  multiple?: false;
  /** Controlled selected value. */
  value?: string | null;
  /** Initial selected value for uncontrolled usage. */
  defaultValue?: string | null;
  /** Called when the selected value changes. */
  onValueChange?: (value: string | null) => void;
};

export type SelectMultipleProps = SelectSharedProps & {
  /** Enables multiple selection. */
  multiple: true;
  /** Controlled selected values. */
  value?: string[];
  /** Initial selected values for uncontrolled usage. */
  defaultValue?: string[];
  /** Called when the selected values change. */
  onValueChange?: (value: string[]) => void;
};

export type SelectProps = SelectSingleProps | SelectMultipleProps;

export type SelectTriggerSlotProps = {
  /** Trigger slot content. */
  children?: ReactNode;
};

export type SelectValueSlotProps = {
  /** Custom value content; defaults to the current selected value text. */
  children?: ReactNode;
};

export type SelectIconSlotProps = {
  /** Icon slot content. */
  children?: ReactNode;
};

export type SelectContentProps = {
  /** Select overlay content. */
  children?: ReactNode;
};

export type SelectSearchProps = {
  /** Placeholder shown in the search field. */
  placeholder?: string;
};

export type SelectGroupProps = {
  /** Visible group label. */
  label?: string;
  /** Allows selecting all options in the group from the group header. */
  selectable?: boolean;
  /** Accessible label for the group-level select action. */
  selectLabel?: string;
  /** Option items rendered inside the group. */
  children?: ReactNode;
};

export type SelectLabelProps = {
  /** Label content for a select group. */
  children?: ReactNode;
};

export type SelectSeparatorProps = Record<string, never>;

export type SelectEmptyProps = {
  /** Empty state content shown when no options match. */
  children?: ReactNode;
};

export type SelectLoadingProps = {
  /** Loading state content shown while options are loading. */
  children?: ReactNode;
};
