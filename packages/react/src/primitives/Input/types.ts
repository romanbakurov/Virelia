import type { BaseInputProps, InputSize, InputType } from '@vellira-ui/types';

export type { InputSize, InputType } from '@vellira-ui/types';

export interface InputProps extends BaseInputProps {
  label: string;
  placeholder?: string;
  size?: InputSize;
  error?: string;
  type?: InputType;
  id?: string;
  className?: string;
  autoComplete?: string;
  showOverflowTooltip?: boolean;
}
