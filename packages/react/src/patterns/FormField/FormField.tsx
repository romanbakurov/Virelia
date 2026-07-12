import { cn } from '@utils/cn';

import type { FormFieldProps } from './types';

import styles from './FormField.module.scss';

export const FormField = ({
  id,
  controlId,
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
  const descriptionId =
    description && controlId ? `${controlId}-description` : undefined;

  const errorId = error && controlId ? `${controlId}-error` : undefined;

  return (
    <div
      {...rest}
      id={id}
      className={cn(styles.wrapper, disabled && styles.disabled, className)}
      data-disabled={disabled || undefined}
      data-invalid={Boolean(error) || undefined}
    >
      {label && (
        <label htmlFor={controlId} className={cn(styles.label, labelClassName)}>
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
