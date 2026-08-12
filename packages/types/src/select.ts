import type { BaseFormFieldProps } from './formField.js';

export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectColor =
  'primary' | 'neutral' | 'success' | 'warning' | 'danger';
export type SelectVariant = 'outline' | 'filled' | 'soft';
export type SelectValue = string;
export type SelectMultipleValue = string[];
export type SelectVirtualConfig = {
  itemHeight?: number;
  maxHeight?: number | string;
  overscan?: number;
  viewportHeight?: number;
};

export interface BaseSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
  icon?: unknown;
  badge?: string;
  shortcut?: string;
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
  isOpen: boolean;
  options: BaseSelectOption[];
  selectedValue: string;
  activeIndex: number;
  onSelect: (value: string) => void;
}

export interface BaseSelectOptionProps {
  option: BaseSelectOption;
  isSelected: boolean;
  isActive: boolean;
  onSelect: (value: string) => void;
}

export interface BaseSelectTriggerProps {
  isOpen: boolean;
  disabled?: boolean;
  required?: boolean;
}
