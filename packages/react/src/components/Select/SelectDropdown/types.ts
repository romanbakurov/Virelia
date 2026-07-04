import type { BaseSelectDropdownProps } from '@vellira-ui/types';
import type { CSSProperties } from 'react';

import type { SelectOption } from '../types';

export interface SelectDropdownProps extends Omit<
  BaseSelectDropdownProps,
  'options'
> {
  listboxId: string;
  labelledById: string;
  options: SelectOption[];
  onMouseEnter: (index: number) => void;
  style: CSSProperties;
  setDropdownRef: (node: HTMLUListElement | null) => void;
}
