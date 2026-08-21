import { Pressable } from 'react-native';

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
    <Pressable
      disabled={disabled}
      accessibilityRole='switch'
      accessibilityState={{
        checked: resolvedChecked,
        disabled,
      }}
      accessibilityHint={
        [required ? 'Required.' : undefined, invalid ? 'Invalid.' : undefined]
          .filter(Boolean)
          .join(' ') || undefined
      }
      onPress={() => onCheckedChange?.(!resolvedChecked)}
    />
  );
}
