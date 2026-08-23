import { useState } from 'react';

import type { SwitchProps } from './types';

import styles from './Switch.module.scss';

export function Switch({
  accessibilityLabel = 'Switch',
  checked,
  defaultChecked = false,
  disabled = false,
  required = false,
  invalid = false,
  onCheckedChange,
}: SwitchProps) {
  const [uncontrolledChecked, setUncontrolledChecked] =
    useState(defaultChecked);
  const isControlled = checked !== undefined;
  const resolvedChecked = isControlled ? checked : uncontrolledChecked;

  const handleClick = () => {
    const nextChecked = !resolvedChecked;

    if (!isControlled) {
      setUncontrolledChecked(nextChecked);
    }

    onCheckedChange?.(nextChecked);
  };

  return (
    <button
      type='button'
      role='switch'
      aria-label={accessibilityLabel}
      aria-checked={resolvedChecked}
      disabled={disabled}
      aria-required={required || undefined}
      aria-invalid={invalid || undefined}
      data-state={resolvedChecked ? 'checked' : 'unchecked'}
      className={styles.root}
      onClick={handleClick}
    >
      <span className={styles.thumb} aria-hidden='true' />
    </button>
  );
}
