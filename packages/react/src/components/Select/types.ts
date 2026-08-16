import type { Placement } from '@floating-ui/react';
import type {
  BaseSelectMultipleProps,
  BaseSelectOption,
  BaseSelectSingleProps,
  SelectVirtualConfig,
} from '@vellira-ui/types';
import type { FocusEventHandler, ReactNode } from 'react';

export interface SelectOption extends Omit<
  BaseSelectOption,
  'badge' | 'description' | 'icon'
> {
  /** Badge content shown with the option. */
  badge?: ReactNode;
  /** Supporting content shown with the option. */
  description?: ReactNode;
  /** Icon shown with the option. */
  icon?: ReactNode;
}

export interface SelectRenderValueContext {
  /** Selected option for single selection, or the first selected option for multiple selection. */
  option: SelectOption | undefined;
  /** All options available to the select. */
  options: SelectOption[];
  /** Current selected value for single selection. */
  value: string;
  /** Current selected values. */
  values: string[];
  /** Whether multiple selection is enabled. */
  multiple: boolean;
}

export interface SelectRenderOptionContext {
  /** Option being rendered. */
  option: SelectOption;
  /** Whether the option is selected. */
  selected: boolean;
  /** Whether the option is disabled. */
  disabled: boolean;
  /** Whether the option is the active keyboard item. */
  active: boolean;
  /** Zero-based option index. */
  index: number;
  /** Current selected values. */
  values: string[];
  /** Whether multiple selection is enabled. */
  multiple: boolean;
  /** Whether the option is currently pressed. */
  pressed: boolean;
}

interface SelectOwnProps {
  /** Custom option elements rendered inside the select. */
  children?: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  /** Unique id applied to the select trigger. */
  id?: string;
  /** Form field name submitted with the selected value. */
  name?: string;
  /** Accessible name for the select trigger when no visible label is used. */
  'aria-label'?: string;
  /** Ids of elements that describe the select trigger. */
  'aria-describedby'?: string;
  /** Ids of elements that label the select trigger. */
  'aria-labelledby'?: string;
  error?: ReactNode;
  /** Content shown when no options match the current query. */
  empty?: ReactNode;
  /** Content shown while options are loading. */
  loadingText?: ReactNode;
  /** Floating content placement relative to the trigger. */
  placement?: Extract<Placement, 'bottom' | 'top' | 'left' | 'right'>;
  /** Matches dropdown width to the trigger width. */
  matchTriggerWidth?: boolean;
  /** Renders dropdown content through a portal. */
  portal?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Called when the search query changes. */
  onSearch?: (value: string) => void;
  /** Called when the clear action is activated. */
  onClear?: () => void;
  /** Icon rendered before the selected value. */
  startIcon?: ReactNode;
  /** Icon rendered after the selected value. */
  endIcon?: ReactNode;
  /** Content rendered before the trigger value. */
  prefix?: ReactNode;
  /** Content rendered after the trigger value. */
  suffix?: ReactNode;
  /** Custom renderer for the trigger value. */
  renderValue?: (context: SelectRenderValueContext) => ReactNode;
  /** Custom renderer for each dropdown option. */
  renderOption?: (context: SelectRenderOptionContext) => ReactNode;
  /** Called when the select trigger loses focus. */
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  /** Called when the select trigger receives focus. */
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  /** Class name applied to the root element. */
  className?: string;
  /** Class name applied to the trigger element. */
  triggerClassName?: string;
  /** Class name applied to the dropdown element. */
  dropdownClassName?: string;
}

export type SelectSingleProps = Omit<
  BaseSelectSingleProps,
  | 'options'
  | 'label'
  | 'description'
  | 'error'
  | 'value'
  | 'defaultValue'
  | 'onValueChange'
> &
  SelectOwnProps & {
    /** Controlled selected value. Null represents no selection. */
    value?: string | null;
    /** Initial selected value for uncontrolled usage. Null represents no selection. */
    defaultValue?: string | null;
    /** Called when the selected value changes. Null represents no selection. */
    onValueChange?: (value: string | null) => void;
  };

export type SelectMultipleProps = Omit<
  BaseSelectMultipleProps,
  'options' | 'label' | 'description' | 'error'
> &
  SelectOwnProps;

export type SelectProps = SelectSingleProps | SelectMultipleProps;

export type { SelectVirtualConfig };
