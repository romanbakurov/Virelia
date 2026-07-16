import type { RadioColor, RadioValue } from './radio';

export type RadioGroupOrientation = 'vertical' | 'horizontal';
export type RadioSize = 'sm' | 'md' | 'lg';

export interface BaseRadioGroupProps {
  /** Controlled selected value. */
  value?: RadioValue;
  /** Initial selected value for uncontrolled usage. */
  defaultValue?: RadioValue;
  /** Disables every radio in the group. */
  disabled?: boolean;
  /** Marks the radio group as required. */
  required?: boolean;
  /** Layout direction. */
  orientation?: RadioGroupOrientation;
  /** Size inherited by child radios. */
  size?: RadioSize;
  /** Selected color inherited by child radios. */
  color?: RadioColor;
  /** Called when selection changes. */
  onValueChange?: (value: RadioValue) => void;
}
