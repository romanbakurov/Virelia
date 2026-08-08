import type { BaseSelectOptionProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';

import type { SelectOption, SelectRenderOptionContext } from '../types';

export interface SelectItemProps {
  value: string;
  children?: ReactNode;
  label?: string;
  disabled?: boolean;
  description?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  shortcut?: string;
  color?: SelectOption['color'];
}

export interface SelectItemRowProps extends Omit<
  BaseSelectOptionProps,
  'option'
> {
  option: SelectOption;
  optionId: string;
  optionIndex: number;
  selectedValues: string[];
  multiple: boolean;
  renderOption?: (context: SelectRenderOptionContext) => ReactNode;
  onMouseEnter: () => void;
}
