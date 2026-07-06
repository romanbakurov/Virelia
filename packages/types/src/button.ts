export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonColor = 'primary' | 'secondary' | 'close' | 'danger';
export type ButtonVariant = 'solid' | 'outline' | 'ghost';

export interface BaseButtonProps {
  color?: ButtonColor;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  iconOnly?: boolean;
}
