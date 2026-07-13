import type { BaseFormFieldProps } from './formField.js';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface BaseSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface BaseSelectProps extends Pick<
  BaseFormFieldProps,
  'label' | 'description' | 'error' | 'required' | 'disabled'
> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: BaseSelectOption[];
  placeholder?: string;
  size?: SelectSize;
}

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
