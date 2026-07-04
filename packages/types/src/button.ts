export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonColor = 'primary' | 'secondary' | 'danger';

export interface BaseButtonProps {
  variant?: ButtonColor;
  size?: ButtonSize;
  disabled?: boolean;
}
