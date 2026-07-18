import type { BaseFormFieldProps } from './formField.js';

export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectColor =
  'primary' | 'neutral' | 'success' | 'warning' | 'danger';
export type SelectVariant = 'outline' | 'filled' | 'soft';
export type SelectValue = string;
export type SelectMultipleValue = string[];
export type SelectVirtualConfig = {
  itemHeight?: number;
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
  options: BaseSelectOption[];
  placeholder?: string;
  size?: SelectSize;
  color?: SelectColor;
  variant?: SelectVariant;
  invalid?: boolean;
  loading?: boolean;
  clearable?: boolean;
  searchable?: boolean;
  maxSelected?: number;
  closeOnSelect?: boolean;
  virtual?: boolean | SelectVirtualConfig;
}

export interface BaseSelectSingleProps extends BaseSelectSharedProps {
  multiple?: false;
  value?: SelectValue;
  defaultValue?: SelectValue;
  onValueChange?: (value: SelectValue) => void;
  /** @deprecated Use onValueChange. */
  onChange?: (value: SelectValue) => void;
}

export interface BaseSelectMultipleProps extends BaseSelectSharedProps {
  multiple: true;
  value?: SelectMultipleValue;
  defaultValue?: SelectMultipleValue;
  onValueChange?: (value: SelectMultipleValue) => void;
  /** @deprecated Use onValueChange. */
  onChange?: (value: SelectMultipleValue) => void;
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
