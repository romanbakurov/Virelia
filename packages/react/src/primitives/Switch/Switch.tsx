import type { SwitchProps } from './types';

export function Switch({
  checked,
  defaultChecked = false,
  disabled = false,
  required = false,
  invalid = false,
  onCheckedChange,
}: SwitchProps) {
  const resolvedChecked = checked ?? defaultChecked;

  return (
    <button
      type='button'
      role='switch'
      aria-checked={resolvedChecked}
      disabled={disabled}
      aria-required={required || undefined}
      aria-invalid={invalid || undefined}
      onClick={() => onCheckedChange?.(!resolvedChecked)}
    />
  );
}
