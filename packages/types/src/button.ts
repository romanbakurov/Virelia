export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonColor =
  'primary' | 'neutral' | 'success' | 'warning' | 'danger';
export type ButtonAppearance = 'solid' | 'outline' | 'ghost' | 'soft' | 'link';
export type ButtonShape = 'square' | 'rounded' | 'pill';

export interface BaseButtonProps {
  /** Visual tone for the button action. */
  color?: ButtonColor;
  /** Visual style for the button surface. */
  appearance?: ButtonAppearance;
  /** Button size. */
  size?: ButtonSize;
  /** Corner shape for the button. */
  shape?: ButtonShape;
  /** Makes the button fill its container width. */
  fullWidth?: boolean;
  /** Shows a loading indicator and disables interaction. */
  loading?: boolean;
  /** Replaces visible content while loading. */
  loadingText?: string;
  /** Disables interaction. */
  disabled?: boolean;
  /** Renders the button as an icon-only action. */
  iconOnly?: boolean;
}
