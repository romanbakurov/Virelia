import { forwardRef, useCallback, useEffect, useId, useRef } from 'react';

import { cn } from '@utils/cn';
import { devWarning } from '@utils/devWarning';
import { Check } from '@vellira-ui/icons';
import type { ChangeEvent } from 'react';

import { useControllableState } from '@/hooks';

import type { CheckboxProps } from './types';

import styles from './Checkbox.module.scss';

const labelSizeClassNameBySize = {
  sm: styles.labelSm,
  md: styles.labelMd,
  lg: styles.labelLg,
} as const;

const wrapperSizeClassNameBySize = {
  sm: styles.wrapperSm,
  md: styles.wrapperMd,
  lg: styles.wrapperLg,
} as const;

const containerSizeClassNameBySize = {
  sm: styles.containerSm,
  md: styles.containerMd,
  lg: styles.containerLg,
} as const;

const colorClassNameByColor = {
  primary: styles.colorPrimary,
  neutral: styles.colorNeutral,
  success: styles.colorSuccess,
  warning: styles.colorWarning,
  danger: styles.colorDanger,
} as const;

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      id: providedId,
      label,
      description,
      icon,
      indeterminateIcon,
      checked,
      size = 'md',
      color = 'primary',
      labelPosition = 'end',
      defaultChecked = false,
      disabled = false,
      required = false,
      indeterminate = false,
      className,
      wrapperClassName,
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
      <div
        className={cn(
          styles.container,
          containerSizeClassNameBySize[size],
          labelPosition === 'start' && styles.containerLabelStart,
          className
        )}
      >
        <label
          htmlFor={id}
          className={cn(
            styles.wrapper,
            wrapperSizeClassNameBySize[size],
            colorClassNameByColor[color],
            labelPosition === 'start' && styles.labelStart,
            !label && styles.iconOnly,
            disabled && styles.disabled,
            wrapperClassName
          )}
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
            className={styles.input}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-checked={indeterminate ? 'mixed' : inputProps['aria-checked']}
            aria-invalid={hasError ? true : inputProps['aria-invalid']}
            aria-describedby={describedBy || undefined}
          />

          <span
            className={cn(
              styles.customCheckbox,
              hasError && styles.error,
              indeterminate && styles.indeterminate
            )}
            aria-hidden='true'
          >
            {indeterminate ? (
              <span
                className={cn(
                  styles.indeterminateMark,
                  indeterminateIcon && styles.customMark
                )}
              >
                {indeterminateIcon}
              </span>
            ) : (
              isChecked && (
                <span className={styles.checkmark}>{icon ?? <Check />}</span>
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
          <span id={descriptionId} className={styles.descriptionText}>
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
