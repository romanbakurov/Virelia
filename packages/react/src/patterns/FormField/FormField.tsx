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
  controlClassName,
  labelClassName,
  descriptionClassName,
  errorClassName,
  ...rest
}: FormFieldProps) => {
  const descriptionId = description && id ? `${id}-description` : undefined;

  const errorId = error && id ? `${id}-error` : undefined;

  return (
    <div
      {...rest}
      aria-disabled={disabled || undefined}
      className={cn(styles.wrapper, disabled && styles.disabled, className)}
      data-disabled={disabled || undefined}
      data-invalid={Boolean(error) || undefined}
    >
      {label && (
        <label htmlFor={id} className={cn(styles.label, labelClassName)}>
          {label}

          {required && (
            <span className={styles.required} aria-hidden='true'>
              *
            </span>
          )}
        </label>
      )}

      {description && (
        <div
          id={descriptionId}
          className={cn(styles.description, descriptionClassName)}
        >
          {description}
        </div>
      )}

      <div className={cn(styles.control, controlClassName)}>{children}</div>

      {error && (
        <div
          id={errorId}
          className={cn(styles.errorText, errorClassName)}
          role='alert'
        >
          {error}
        </div>
      )}
    </div>
  );
};
