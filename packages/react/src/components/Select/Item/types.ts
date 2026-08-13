import type { BaseSelectOptionProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';

import type { SelectCollectionOption } from '../internal/types';
import type { SelectOption, SelectRenderOptionContext } from '../types';

export interface SelectItemProps {
  /** Value represented by this option. */
  value: string;
  /** Option label or custom option content. */
  children?: ReactNode;
  /** Composes item behavior onto a single child element. */
  asChild?: boolean;
  /** Text label used when children are custom content. */
  label?: string;
  /** Disables selection for this option. */
  disabled?: boolean;
  /** Supporting text shown with the option. */
  description?: ReactNode;
  /** Icon shown before the option label. */
  icon?: ReactNode;
  /** Badge content shown after the option label. */
  badge?: ReactNode;
  /** Keyboard shortcut hint shown after the option label. */
  shortcut?: string;
  /** Semantic color palette for the option. */
  color?: SelectOption['color'];
}

export interface SelectItemRowProps extends Omit<
  BaseSelectOptionProps,
  'option'
> {
  option: SelectCollectionOption;
  optionId: string;
  optionIndex: number;
  selectedValues: string[];
  multiple: boolean;
  renderOption?: (context: SelectRenderOptionContext) => ReactNode;
  onMouseEnter: () => void;
}
