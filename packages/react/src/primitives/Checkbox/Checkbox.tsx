import { forwardRef, useCallback, useEffect, useId, useRef } from 'react';

import { cn } from '@utils/cn';
import { devWarning } from '@utils/devWarning';
import { useControllableState } from '@vellira-ui/core';
import { Check } from '@vellira-ui/icons';
import type { ChangeEvent } from 'react';

import type { CheckboxProps } from './types';

import styles from './Checkbox.module.scss';

const sizeClassNameBySize = {
  sm: styles.checkboxSm,
  md: styles.checkboxMd,
  lg: styles.checkboxLg,
} as const;

const labelSizeClassNameBySize = {
  sm: styles.labelSm,
  md: styles.labelMd,
  lg: styles.labelLg,
} as const;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id: providedId,
      label,
      description,
      checked,
      size = 'md',
      defaultChecked = false,
      disabled = false,
      required = false,
      indeterminate = false,
      className,
      onCheckedChange,
      error,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      ...inputProps
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;

    const inputRef = useRef<HTMLInputElement | null>(null);

    const hasError = Boolean(error);
    const descriptionId = description ? `${id}-description` : undefined;
    const errorId = hasError ? `${id}-error` : undefined;

    const describedBy = [ariaDescribedBy, descriptionId, errorId]
      .filter(Boolean)
      .join(' ');

    const [isChecked, setIsChecked] = useControllableState({
      value: checked,
      defaultValue: defaultChecked,
      onChange: onCheckedChange,
    });

    const setRefs = useCallback(
      (element: HTMLInputElement | null) => {
        inputRef.current = element;

        if (typeof ref === 'function') {
          ref(element);
          return;
        }

        if (ref) {
          ref.current = element;
        }
      },
      [ref]
    );

    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      setIsChecked(event.target.checked);
    };

    devWarning(
      Boolean(label || ariaLabel || ariaLabelledBy),
      'Checkbox: an accessible label must be provided through label, aria-label, or aria-labelledby.'
    );

    return (
      <div className={styles.container}>
        <label
          htmlFor={id}
          className={cn(styles.wrapper, disabled && styles.disabled)}
        >
          <input
            {...inputProps}
            ref={setRefs}
            id={id}
            type='checkbox'
            checked={isChecked}
            disabled={disabled}
            required={required}
            onChange={handleChange}
            className={cn(styles.input, className)}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-invalid={hasError ? true : inputProps['aria-invalid']}
            aria-describedby={describedBy || undefined}
          />

          <span
            className={cn(
              styles.customCheckbox,
              sizeClassNameBySize[size],
              hasError && styles.error,
              indeterminate && styles.indeterminate
            )}
            aria-hidden='true'
          >
            {indeterminate ? (
              <span className={styles.indeterminateMark} />
            ) : (
              isChecked && (
                <span className={styles.checkmark}>
                  <Check />
                </span>
              )
            )}
          </span>

          {label && (
            <span className={cn(styles.label, labelSizeClassNameBySize[size])}>
              {label}
              {required && (
                <span className={styles.requiredMark} aria-hidden='true'>
                  *
                </span>
              )}
            </span>
          )}
        </label>

        {description && (
          <span id={descriptionId} className={styles.description}>
            {description}
          </span>
        )}

        {hasError && (
          <span id={errorId} className={styles.errorText}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
