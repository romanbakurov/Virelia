import { useId } from 'react';

import { cn } from '@utils/cn';

import type { FormFieldProps } from './types';

import styles from './FormField.module.scss';

export const FormField = ({
  id,
  label,
  description,
  error,
  required = false,
  disabled = false,
  children,
  className,
}: FormFieldProps) => {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  const descriptionId = description ? `${fieldId}-description` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div
      className={cn(
        styles.wrapper,
        {
          [styles.disabled]: disabled,
        },
        className
      )}
      data-disabled={disabled || undefined}
      data-invalid={!!error || undefined}
    >
      {label && (
        <label className={styles.label} htmlFor={fieldId}>
          {label}

          {required && (
            <span className={styles.required} aria-hidden='true'>
              *
            </span>
          )}
        </label>
      )}

      {description && (
        <span className={styles.description} id={descriptionId}>
          {description}
        </span>
      )}

      <div className={styles.control}>{children}</div>

      {error && (
        <span className={styles.errorText} id={errorId} role='alert'>
          {error}
        </span>
      )}
    </div>
  );
};
