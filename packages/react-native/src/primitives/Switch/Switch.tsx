import { useState } from 'react';

import { Pressable, View } from 'react-native';

import { useThemeStyles } from '../../theme';

import { createStyles } from './Switch.styles';
import type { SwitchProps } from './types';

export function Switch({
  accessibilityLabel = 'Switch',
  checked,
  defaultChecked = false,
  disabled = false,
  required = false,
  invalid = false,
  onCheckedChange,
}: SwitchProps) {
  const styles = useThemeStyles(createStyles);
  const [uncontrolledChecked, setUncontrolledChecked] =
    useState(defaultChecked);
  const isControlled = checked !== undefined;
  const resolvedChecked = isControlled ? checked : uncontrolledChecked;

  const handlePress = () => {
    const nextChecked = !resolvedChecked;

    if (!isControlled) {
      setUncontrolledChecked(nextChecked);
    }

    onCheckedChange?.(nextChecked);
  };

  return (
    <Pressable
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='switch'
      accessibilityState={{ checked: resolvedChecked, disabled }}
      accessibilityHint={
        [required ? 'Required.' : undefined, invalid ? 'Invalid.' : undefined]
          .filter(Boolean)
          .join(' ') || undefined
      }
      onPress={handlePress}
      style={({ pressed }) => [
        styles.root,
        resolvedChecked && styles.checked,
        pressed && !disabled && styles.pressed,
        resolvedChecked && pressed && !disabled && styles.checkedPressed,
        invalid && styles.invalid,
        disabled && styles.disabled,
      ]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.thumb,
            resolvedChecked && styles.thumbChecked,
            resolvedChecked &&
              pressed &&
              !disabled &&
              styles.thumbCheckedPressed,
            disabled && styles.thumbDisabled,
          ]}
        />
      )}
    </Pressable>
  );
}
