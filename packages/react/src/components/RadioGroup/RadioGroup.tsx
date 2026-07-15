import { forwardRef, useId } from 'react';

import { useControllableState } from '@vellira-ui/core';

import { cn } from '../../utils/cn';

import { RadioGroupProvider } from './RadioGroupContext';
import type { RadioGroupProps } from './types';

import styles from './RadioGroup.module.scss';

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      value,
      defaultValue = '',
      onValueChange,
      disabled = false,
      required = false,
      size = 'md',
      name,
      label,
      description,
      error,
      orientation = 'vertical',
      children,
      className,
      id,
      ...rest
    },
    ref
  ) => {
    const generatedId = useId();
    const groupId = id ?? generatedId;

    const labelId = label ? `${groupId}-label` : undefined;
    const descriptionId = description ? `${groupId}-description` : undefined;
    const errorId = error ? `${groupId}-error` : undefined;

    const describedBy =
      [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

    const resolvedName = name ?? `${groupId}-radio`;

    const [currentValue, setCurrentValue] = useControllableState({
      value,
      defaultValue,
      onChange: onValueChange,
    });

    const invalid = Boolean(error);

    return (
      <div
        {...rest}
        ref={ref}
        id={groupId}
        role='radiogroup'
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        aria-disabled={disabled || undefined}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        className={cn(
          styles.root,
          invalid && styles.invalid,
          disabled && styles.disabled,
          className
        )}
      >
        {label && (
          <div id={labelId} className={styles.label}>
            {label}

            {required && (
              <span className={styles.required} aria-hidden='true'>
                *
              </span>
            )}
          </div>
        )}

        {description && (
          <div id={descriptionId} className={styles.description}>
            {description}
          </div>
        )}

        <RadioGroupProvider
          value={{
            name: resolvedName,
            value: currentValue,
            disabled,
            required,
            invalid,
            size,
            describedBy,
            onValueChange: setCurrentValue,
          }}
        >
          <div className={cn(styles.items, styles[orientation])}>
            {children}
          </div>
        </RadioGroupProvider>

        {error && (
          <div id={errorId} className={styles.error}>
            {error}
          </div>
        )}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
