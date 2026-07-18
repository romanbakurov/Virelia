import type { BaseSelectOptionProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';

import type { SelectOption } from '../types';

export interface SelectOptionProps extends Omit<
  BaseSelectOptionProps,
  'option'
> {
  option: SelectOption;
  optionId: string;
  renderOption?: (option: SelectOption) => ReactNode;
  onMouseEnter: () => void;
}
