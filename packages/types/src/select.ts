import type { BaseFormFieldProps } from './formField.js';

export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectColor =
  'primary' | 'neutral' | 'success' | 'warning' | 'danger';
export type SelectVariant = 'outline' | 'filled' | 'soft';
export type SelectValue = string;
export type SelectMultipleValue = string[];
export type SelectVirtualConfig = {
  /** Estimated row height used for virtualized option measurement. */
  itemHeight?: number;
  /** Maximum height for the virtualized option viewport. */
  maxHeight?: number | string;
  /** Number of offscreen items rendered before and after the viewport. */
  overscan?: number;
  /** Explicit viewport height used by virtualized rendering. */
  viewportHeight?: number;
};

export interface BaseSelectOption {
  /** Human-readable option label. */
  label: string;
  /** Submitted option value. */
  value: string;
  /** Disables selection for this option. */
  disabled?: boolean;
  /** Supporting text shown with the option. */
  description?: string;
  /** Icon shown with the option. */
  icon?: unknown;
  /** Badge content shown with the option. */
  badge?: string;
  /** Keyboard shortcut hint shown with the option. */
  shortcut?: string;
  /** Semantic color palette for the option. */
  color?: SelectColor;
}

export interface BaseSelectSharedProps extends Pick<
  BaseFormFieldProps,
  'label' | 'description' | 'error' | 'required' | 'disabled'
> {
  /** Option data used to populate the select when using the options-based API. */
  options: BaseSelectOption[];

  /** Placeholder shown when no value is selected. */
  placeholder?: string;

  /** Controls the overall select size. */
  size?: SelectSize;

  /** Semantic color palette for the control. */
  color?: SelectColor;

  /** Visual variant for the select trigger. */
  variant?: SelectVariant;

  /** Shows invalid styling without requiring error text. */
  invalid?: boolean;

  /** Shows the select in a loading state. */
  loading?: boolean;

  /** Shows a clear action when the select has a value. */
  clearable?: boolean;

  /** Enables option filtering through a search field. */
  searchable?: boolean;

  /** Maximum number of values that can be selected. */
  maxSelected?: number;

  /** Controls whether the overlay closes after selecting an option. */
  closeOnSelect?: boolean;

  /** Enables virtualization for large option collections. */
  virtual?: boolean | SelectVirtualConfig;

  /** Adjusts floating content placement to avoid viewport collisions. */
  avoidCollisions?: boolean;

  /** Uses modal interaction semantics for the overlay. */
  modal?: boolean;

  /** Enables command-style interaction behavior. */
  command?: boolean;
}

export interface BaseSelectSingleProps extends BaseSelectSharedProps {
  /** Enables single-selection mode. */
  multiple?: false;

  /** Controlled selected value. */
  value?: SelectValue;

  /** Initial selected value for uncontrolled usage. */
  defaultValue?: SelectValue;

  /** Called when the selected value changes. */
  onValueChange?: (value: SelectValue) => void;
}

export interface BaseSelectMultipleProps extends BaseSelectSharedProps {
  /** Enables multiple selection. */
  multiple: true;

  /** Controlled selected values. */
  value?: SelectMultipleValue;

  /** Initial selected values for uncontrolled usage. */
  defaultValue?: SelectMultipleValue;

  /** Called when the selected values change. */
  onValueChange?: (value: SelectMultipleValue) => void;
}

export type BaseSelectProps = BaseSelectSingleProps | BaseSelectMultipleProps;

export interface BaseSelectDropdownProps {
  /** Whether the dropdown is currently open. */
  isOpen: boolean;
  /** Options rendered in the dropdown. */
  options: BaseSelectOption[];
  /** Currently selected value. */
  selectedValue: string;
  /** Index of the active option. */
  activeIndex: number;
  /** Called when an option value is selected. */
  onSelect: (value: string) => void;
}

export interface BaseSelectOptionProps {
  /** Option rendered by this row. */
  option: BaseSelectOption;
  /** Whether the option is selected. */
  isSelected: boolean;
  /** Whether the option is active for keyboard navigation. */
  isActive: boolean;
  /** Called when this option value is selected. */
  onSelect: (value: string) => void;
}

export interface BaseSelectTriggerProps {
  /** Whether the select overlay is currently open. */
  isOpen: boolean;
  /** Disables trigger interaction. */
  disabled?: boolean;
  /** Marks the trigger as required for accessibility and form semantics. */
  required?: boolean;
}
