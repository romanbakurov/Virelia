export interface BaseSwitchProps {
  /** Accessible name announced by assistive technology. */
  accessibilityLabel?: string;
  /** Controlled checked state. */
  checked?: boolean;
  /** Initial checked state for uncontrolled usage. */
  defaultChecked?: boolean;
  /** Disables interaction. */
  disabled?: boolean;
  /** Marks the control as required. */
  required?: boolean;
  /** Marks the control as invalid. */
  invalid?: boolean;
  /** Called when the checked state changes. */
  onCheckedChange?: (checked: boolean) => void;
}
