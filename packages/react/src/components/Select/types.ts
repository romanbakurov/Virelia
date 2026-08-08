import type { Placement } from '@floating-ui/react';
import type {
  BaseSelectMultipleProps,
  BaseSelectOption,
  BaseSelectSingleProps,
  SelectVirtualConfig,
} from '@vellira-ui/types';
import type { FocusEventHandler, ReactNode } from 'react';

export interface SelectOption extends Omit<
  BaseSelectOption,
  'badge' | 'description' | 'icon'
> {
  badge?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
}

export interface SelectRenderValueContext {
  option: SelectOption | undefined;
  options: SelectOption[];
  value: string;
  values: string[];
  multiple: boolean;
}

export interface SelectRenderOptionContext {
  option: SelectOption;
  selected: boolean;
  disabled: boolean;
  active: boolean;
  index: number;
  values: string[];
  multiple: boolean;
  pressed: boolean;
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
  placement?: Extract<Placement, 'bottom' | 'top' | 'left' | 'right'>;
  matchTriggerWidth?: boolean;
  avoidCollisions?: boolean;
  portal?: boolean;
  modal?: boolean;
  command?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  renderValue?: (context: SelectRenderValueContext) => ReactNode;
  renderOption?: (context: SelectRenderOptionContext) => ReactNode;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
}

export type SelectSingleProps = Omit<
  BaseSelectSingleProps,
  'options' | 'label' | 'description' | 'error'
> &
  SelectOwnProps;

export type SelectMultipleProps = Omit<
  BaseSelectMultipleProps,
  'options' | 'label' | 'description' | 'error'
> &
  SelectOwnProps;

export type SelectProps = SelectSingleProps | SelectMultipleProps;

export type { SelectVirtualConfig };
