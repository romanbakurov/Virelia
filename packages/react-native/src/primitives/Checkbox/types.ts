import type { BaseCheckboxProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

export interface CheckboxProps
  extends BaseCheckboxProps, Omit<PressableProps, 'onPress' | 'disabled'> {
  /** Visible label rendered next to the control. */
  label?: string;
  /** Helper text rendered below the checkbox row. */
  description?: string;
  /** Icon rendered for the checked state. */
  icon?: ReactNode;
  /** Icon rendered for the indeterminate state. */
  indeterminateIcon?: ReactNode;
  /** Selected checkbox color. */
  color?: BaseCheckboxProps['color'];
  /** Position of the visible label relative to the checkbox. */
  labelPosition?: BaseCheckboxProps['labelPosition'];
  /** Extra style for the clickable wrapper. */
  style?: StyleProp<ViewStyle>;
}
