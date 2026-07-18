import type { Placement } from '@floating-ui/react';
import type {
  BaseSelectMultipleProps,
  BaseSelectOption,
  BaseSelectSingleProps,
  SelectVirtualConfig,
} from '@vellira-ui/types';
import type { FocusEventHandler, ReactNode } from 'react';

export interface SelectOption extends Omit<BaseSelectOption, 'icon'> {
  icon?: ReactNode;
}

interface SelectOwnProps {
  children?: ReactNode;
  label?: ReactNode;
  description?: ReactNode;
  id?: string;
  name?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  error?: ReactNode;
  empty?: ReactNode;
  loadingText?: ReactNode;
  noOptionsText?: ReactNode;
  placement?: Extract<Placement, 'bottom' | 'top' | 'left' | 'right'>;
  matchTriggerWidth?: boolean;
  portal?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  renderValue?: (option: SelectOption | undefined) => ReactNode;
  renderOption?: (option: SelectOption) => ReactNode;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
}

export type SelectSingleProps = Omit<
  BaseSelectSingleProps,
  'options' | 'label' | 'description' | 'error' | 'onChange'
> &
  SelectOwnProps;

export type SelectMultipleProps = Omit<
  BaseSelectMultipleProps,
  'options' | 'label' | 'description' | 'error' | 'onChange'
> &
  SelectOwnProps;

export type SelectProps = SelectSingleProps | SelectMultipleProps;

export type { SelectVirtualConfig };
