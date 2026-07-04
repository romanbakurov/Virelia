import type { ControlSize } from './common';

export type ButtonSize = ControlSize;
export type ButtonColor = 'primary' | 'secondary' | 'danger';

export interface BaseButtonProps {
  variant?: ButtonColor;
  size?: ButtonSize;
  disabled?: boolean;
}
