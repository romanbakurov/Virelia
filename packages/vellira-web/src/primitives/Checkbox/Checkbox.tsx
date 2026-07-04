import { forwardRef, useId } from 'react';

import { useControllableState } from '@romanbakurov/vellira-core';
import { Check } from '@romanbakurov/vellira-icons';
import { cn } from '@utils/cn';
import type { ChangeEvent } from 'react';

import type { CheckboxProps } from './types';

import styles from './Checkbox.module.scss';

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      checked,
      defaultChecked = false,
      disabled = false,
      className,
      onCheckedChange,
      error,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;
    const hasError = Boolean(error);

    const [isChecked, setIsChecked] = useControllableState({
      value: checked,
      defaultValue: defaultChecked,
      onChange: onCheckedChange,
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      setIsChecked(event.target.checked);
    };

    return (
      <div className={styles.container}>
        <label
          {...props}
          htmlFor={checkboxId}
          className={cn(styles.wrapper, disabled && styles.disabled, className)}
        >
          <input
            ref={ref}
            id={checkboxId}
            type='checkbox'
            checked={isChecked}
            disabled={disabled}
            onChange={handleChange}
            className={styles.input}
            aria-invalid={hasError || undefined}
            aria-describedby={hasError ? `${checkboxId}-error` : undefined}
            aria-label={!label ? props['aria-label'] || 'Checkbox' : undefined}
          />

          <span
            className={cn(styles.customCheckbox, hasError && styles.error)}
            aria-hidden='true'
          >
            {isChecked && (
              <span className={styles.checkmark}>
                <Check />
              </span>
            )}
          </span>

          {label && <span className={styles.label}>{label}</span>}
        </label>

        {hasError && (
          <span id={`${checkboxId}-error`} className={styles.errorText}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
