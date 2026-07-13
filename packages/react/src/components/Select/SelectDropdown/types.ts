import type { BaseSelectDropdownProps } from '@vellira-ui/types';
import type { CSSProperties, ReactNode } from 'react';

import type { SelectOption } from '../types';

export interface SelectDropdownProps extends Omit<
  BaseSelectDropdownProps,
  'options'
> {
  listboxId: string;
  labelledById: string;
  options: SelectOption[];
  noOptionsText: ReactNode;
  className?: string;
  onMouseEnter: (index: number) => void;
  style: CSSProperties;
  setDropdownRef: (node: HTMLUListElement | null) => void;
}
