import { forwardRef, useCallback, useId, useRef, useState } from 'react';

import { FormField } from '@patterns/FormField';
import { cn } from '@utils/cn';
import type { ChangeEvent, InputHTMLAttributes } from 'react';

import type { InputProps } from './types';

import styles from './Input.module.scss';

const toneClassNameByTone = {
  default: styles.toneDefault,
  primary: styles.tonePrimary,
  secondary: styles.toneSecondary,
  success: styles.toneSuccess,
  danger: styles.toneDanger,
  muted: styles.toneMuted,
  inverse: styles.toneInverse,
} as const;

const getAutoComplete = (
  type: InputHTMLAttributes<HTMLInputElement>['type'] = 'text',
  autoComplete?: string
) => {
  if (autoComplete) return autoComplete;

  switch (type) {
    case 'email':
      return 'email';
    case 'password':
      return 'current-password';
    case 'tel':
      return 'tel';
    case 'url':
      return 'url';
    case 'search':
      return 'off';
    default:
      return undefined;
  }
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id: providedId,
      label,
      name,
      description,
      placeholder,
      value,
      defaultValue,
      onChange,
      type = 'text',
      size = 'md',
      error,
      disabled = false,
      required = false,
      className,
      autoComplete,
      readOnly = false,
      clearable = false,
      onClear,
      leftAdornment,
      rightAdornment,
      clearIcon,
      leftAdornmentTone = 'default',
      rightAdornmentTone = 'default',
      clearIconTone = 'danger',
      autoFocus,
      maxLength,
      onMouseEnter,
      onMouseLeave,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      ...inputProps
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;

    const inputRef = useRef<HTMLInputElement | null>(null);

    const [uncontrolledValue, setUncontrolledValue] = useState(
      defaultValue ?? ''
    );

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : uncontrolledValue;
    const hasValue = currentValue !== '';

    const resolvedAutoComplete = getAutoComplete(type, autoComplete);
    const showClearButton = clearable && hasValue && !disabled && !readOnly;
    const descriptionId = description ? `${id}-description` : undefined;
    const errorId = error ? `${id}-error` : undefined;
    const describedBy = [ariaDescribedBy, descriptionId, errorId]
      .filter(Boolean)
      .join(' ');

    const clearIconNode = clearIcon ?? '×';

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

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const nextValue = event.target.value;

        if (!isControlled) {
          setUncontrolledValue(nextValue);
        }

        onChange?.(event);
      },
      [isControlled, onChange]
    );

    const handleClear = useCallback(() => {
      if (!isControlled) {
        setUncontrolledValue('');
      }

      onClear?.();
      inputRef.current?.focus();
    }, [isControlled, onClear]);

    const showRightAdornment = !showClearButton && Boolean(rightAdornment);

    return (
      <FormField
        id={id}
        label={label}
        description={description}
        error={error}
        required={required}
        disabled={disabled}
      >
        <div
          className={cn(styles.inputWrapper, {
            [styles.hasLeftAdornment]: !!leftAdornment,
            [styles.hasRightAdornment]: !!rightAdornment || showClearButton,
          })}
        >
          {leftAdornment && (
            <span
              aria-hidden='true'
              className={cn(
                styles.leftAdornment,
                toneClassNameByTone[leftAdornmentTone]
              )}
            >
              {leftAdornment}
            </span>
          )}

          <input
            {...inputProps}
            ref={setRefs}
            id={id}
            name={name}
            type={type}
            autoComplete={resolvedAutoComplete}
            className={cn(
              styles.input,
              styles[size],
              {
                [styles.error]: !!error,
              },
              className
            )}
            value={currentValue}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            autoFocus={autoFocus}
            maxLength={maxLength}
            aria-invalid={error ? true : ariaInvalid}
            aria-describedby={describedBy || undefined}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />

          {showClearButton && (
            <button
              type='button'
              className={cn(
                styles.clearButton,
                toneClassNameByTone[clearIconTone]
              )}
              onClick={handleClear}
              aria-label='Clear input'
            >
              {clearIconNode}
            </button>
          )}

          {showRightAdornment && (
            <div
              className={cn(
                styles.rightAdornment,
                toneClassNameByTone[rightAdornmentTone]
              )}
            >
              {rightAdornment}
            </div>
          )}
        </div>
      </FormField>
    );
  }
);

Input.displayName = 'Input';
