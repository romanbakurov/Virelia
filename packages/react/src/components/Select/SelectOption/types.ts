import type { BaseSelectOptionProps } from '@vellira-ui/types';

import type { SelectOption } from '../types';

export interface SelectOptionProps extends Omit<
  BaseSelectOptionProps,
  'option'
> {
  option: SelectOption;
  optionId: string;
  onMouseEnter: () => void;
}
