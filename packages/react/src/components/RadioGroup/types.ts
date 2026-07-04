import type {
  BaseRadioGroupProps,
  BaseRadioOption,
  Orientation,
} from '@vellira-ui/types';

export interface RadioOption extends BaseRadioOption {
  label: string;
}

export interface RadioGroupProps extends Omit<BaseRadioGroupProps, 'options'> {
  label?: string;
  description?: string;
  name: string;
  options: RadioOption[];
  error?: string;
  orientation?: Orientation;
  className?: string;
}
