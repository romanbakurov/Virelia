import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

import { FormField } from '@patterns/FormField';
import { cn } from '@utils/cn';
import type { ChangeEvent, MouseEvent } from 'react';

import type { InputProps } from './types';

import styles from './Input.module.scss';

const getAutoComplete = (type = 'text', autoComplete?: string) => {
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

const setInputValue = (input: HTMLInputElement, nextValue: string) => {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value'
  )?.set;

  nativeInputValueSetter?.call(input, nextValue);
  input.dispatchEvent(new Event('input', { bubbles: true }));
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
      showOverflowTooltip = false,
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
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

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

    const checkOverflow = useCallback(() => {
      const input = inputRef.current;

      if (!input) {
        setIsOverflowing(false);
        return;
      }

      setIsOverflowing(input.scrollWidth > input.clientWidth);
    }, []);

    useEffect(() => {
      if (!showOverflowTooltip) return;

      checkOverflow();

      if (typeof ResizeObserver === 'undefined') {
        window.addEventListener('resize', checkOverflow);

        return () => {
          window.removeEventListener('resize', checkOverflow);
        };
      }

      const resizeObserver = new ResizeObserver(checkOverflow);

      if (inputRef.current) {
        resizeObserver.observe(inputRef.current);
      }

      window.addEventListener('resize', checkOverflow);

      return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', checkOverflow);
      };
    }, [checkOverflow, showOverflowTooltip]);

    useEffect(() => {
      if (!showOverflowTooltip) return;
      checkOverflow();
    }, [currentValue, checkOverflow, showOverflowTooltip]);

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
      const input = inputRef.current;

      if (!input) return;

      if (!isControlled) {
        setUncontrolledValue('');
      }

      setInputValue(input, '');
      onClear?.();
      input.focus();
    }, [isControlled, onClear]);

    const handleMouseEnter = useCallback(
      (event: MouseEvent<HTMLInputElement>) => {
        onMouseEnter?.(event);

        if (!showOverflowTooltip) return;

        if (isOverflowing && hasValue) {
          setShowTooltip(true);
        }
      },
      [hasValue, isOverflowing, onMouseEnter, showOverflowTooltip]
    );

    const handleMouseLeave = useCallback(
      (event: MouseEvent<HTMLInputElement>) => {
        onMouseLeave?.(event);
        setShowTooltip(false);
      },
      [onMouseLeave]
    );

    const toneClassNameByTone = {
      default: styles.toneDefault,
      primary: styles.tonePrimary,
      secondary: styles.toneSecondary,
      success: styles.toneSuccess,
      danger: styles.toneDanger,
      muted: styles.toneMuted,
      inverse: styles.toneInverse,
    } as const;

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
                [styles.withEllipsis]: showOverflowTooltip,
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
            aria-invalid={error ? true : (ariaInvalid ?? false)}
            aria-describedby={describedBy || undefined}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />

          {showClearButton && (
            <button
              type='button'
              className={cn(
                styles.clearButton,
                toneClassNameByTone[rightAdornmentTone]
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

          {showOverflowTooltip && showTooltip && isOverflowing && hasValue && (
            <div className={styles.tooltip} role='tooltip'>
              {currentValue}
            </div>
          )}
        </div>
      </FormField>
    );
  }
);

Input.displayName = 'Input';
