import type {
  BaseSelectDropdownProps,
  SelectVirtualConfig,
} from '@vellira-ui/types';
import type { CSSProperties, ReactNode } from 'react';

import type { SelectOption } from '../types';

export interface SelectDropdownProps extends Omit<
  BaseSelectDropdownProps,
  'options'
> {
  listboxId: string;
  labelledById: string;
  options: SelectOption[];
  multiple?: boolean;
  selectedValues?: string[];
  searchable?: boolean;
  virtual?: boolean | SelectVirtualConfig;
  portal?: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  loading?: boolean;
  loadingText?: ReactNode;
  noOptionsText: ReactNode;
  renderOption?: (option: SelectOption) => ReactNode;
  className?: string;
  onMouseEnter: (index: number) => void;
  onSearchChange?: (value: string) => void;
  style: CSSProperties;
  setDropdownRef: (node: HTMLDivElement | null) => void;
}
