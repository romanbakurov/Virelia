export interface BaseSelectOption {
  value: string;
  disabled?: boolean;
}

export interface BaseSelectProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: BaseSelectOption[];
  required?: boolean;
  disabled?: boolean;
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
