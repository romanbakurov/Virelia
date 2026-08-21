export type SwitchProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};
