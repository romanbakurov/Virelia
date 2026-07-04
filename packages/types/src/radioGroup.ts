export interface BaseRadioOption {
  value: string;
  disabled?: boolean;
}

export interface BaseRadioGroupProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: BaseRadioOption[];
  required?: boolean;
  disabled?: boolean;
}
