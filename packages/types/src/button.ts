export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonColor =
  'primary' | 'neutral' | 'success' | 'warning' | 'danger';
export type ButtonAppearance = 'solid' | 'outline' | 'ghost' | 'soft' | 'link';
export type ButtonShape = 'square' | 'rounded' | 'pill';

export interface BaseButtonProps {
  color?: ButtonColor;
  appearance?: ButtonAppearance;
  size?: ButtonSize;
  shape?: ButtonShape;
  fullWidth?: boolean;
  loading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  iconOnly?: boolean;
}
