import type {
  BaseSelectDropdownProps,
  SelectColor,
  SelectVariant,
  SelectVirtualConfig,
} from '@vellira-ui/types';
import type { CSSProperties, ReactNode } from 'react';

import type { SelectRenderEntry } from '../internal/types';
import type { SelectOption, SelectRenderOptionContext } from '../types';

export interface SelectContentSlotProps {
  /** Custom dropdown content slots. */
  children?: ReactNode;
  /** Class name applied to the dropdown content. */
  className?: string;
}

export interface SelectContentProps extends Omit<
  BaseSelectDropdownProps,
  'options'
> {
  listboxId: string;
  labelledById: string;
  options: SelectOption[];
  entries?: SelectRenderEntry[];
  multiple?: boolean;
  selectedValues?: string[];
  color?: SelectColor;
  variant?: SelectVariant;
  searchable?: boolean;
  command?: boolean;
  virtual?: boolean | SelectVirtualConfig;
  portal?: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  loading?: boolean;
  loadingText?: ReactNode;
  emptyText: ReactNode;
  searchSlot?: ReactNode;
  headerSlot?: ReactNode;
  emptySlot?: ReactNode;
  loadingSlot?: ReactNode;
  renderOption?: (context: SelectRenderOptionContext) => ReactNode;
  className?: string;
  visualActiveIndex?: number;
  onSelectGroup: (values: string[]) => void;
  onMouseEnter: (index: number) => void;
  onSearchChange?: (value: string) => void;
  style: CSSProperties;
  setDropdownRef: (node: HTMLDivElement | null) => void;
}
