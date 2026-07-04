import type { BaseSelectOption, BaseSelectProps } from '@vellira-ui/types';

export interface SelectOption extends BaseSelectOption {
  label: string;
}

export interface SelectProps extends Omit<BaseSelectProps, 'options'> {
  label?: string;
  description?: string;
  id?: string;
  name?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  className?: string;
}
