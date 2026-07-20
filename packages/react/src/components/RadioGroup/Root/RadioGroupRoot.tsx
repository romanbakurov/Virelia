import { forwardRef, useId, useRef } from 'react';

import { useControllableState } from '@/hooks';
import { cn } from '@/utils/cn';

import { RadioGroupProvider } from '../internal/RadioGroupContext';
import { useRadioGroupKeyboard } from '../internal/useRadioGroupKeyboard';

import type { RadioGroupProps } from './types';

import styles from '../RadioGroup.module.scss';

export const RadioGroupRoot = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      value,
      defaultValue = '',
      onValueChange,
      disabled = false,
      required = false,
      size = 'md',
      color = 'primary',
      name,
      label,
      description,
      error,
      orientation = 'vertical',
      children,
      className,
      id,
      onKeyDown,
      ...rest
    },
    ref
  ) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
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
    const handleKeyDown = useRadioGroupKeyboard({
      rootRef,
      orientation,
    });

    const setRootRef = (node: HTMLDivElement | null) => {
      rootRef.current = node;

      if (typeof ref === 'function') {
        ref(node);
        return;
      }

      if (ref) {
        ref.current = node;
      }
    };

    return (
      <div
        {...rest}
        ref={setRootRef}
        id={groupId}
        role='radiogroup'
        aria-labelledby={labelId}
        aria-describedby={describedBy}
        aria-disabled={disabled || undefined}
        aria-required={required || undefined}
        aria-invalid={invalid || undefined}
        onKeyDown={(event) => {
          onKeyDown?.(event);

          if (!event.defaultPrevented) {
            handleKeyDown(event);
          }
        }}
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
            color,
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

RadioGroupRoot.displayName = 'RadioGroup.Root';
