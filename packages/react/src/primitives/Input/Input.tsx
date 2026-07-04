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
import type { ChangeEvent } from 'react';

import type { InputProps } from './types';

import styles from './Input.module.scss';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id: providedId,
      label,
      placeholder,
      value,
      onChange,
      size = 'md',
      error,
      disabled = false,
      required = false,
      className,
      autoComplete,
      type = 'text',
      showOverflowTooltip = false,
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;

    const inputRef = useRef<HTMLInputElement | null>(null);

    const [isOverflowing, setIsOverflowing] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const hasValue = value !== undefined && value !== null && value !== '';

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
    }, [value, checkOverflow, showOverflowTooltip]);

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
        onChange?.(event.target.value);
      },
      [onChange]
    );

    const handleMouseEnter = useCallback(() => {
      if (!showOverflowTooltip) return;

      if (isOverflowing && hasValue) {
        setShowTooltip(true);
      }
    }, [hasValue, isOverflowing, showOverflowTooltip]);

    const handleMouseLeave = useCallback(() => {
      setShowTooltip(false);
    }, []);

    return (
      <FormField
        id={id}
        label={label}
        error={error}
        required={required}
        disabled={disabled}
      >
        <div className={styles.inputWrapper}>
          <input
            ref={setRefs}
            id={id}
            type={type}
            autoComplete={autoComplete}
            className={cn(
              styles.input,
              styles[size],
              {
                [styles.error]: !!error,
                [styles.withEllipsis]: showOverflowTooltip,
              },
              className
            )}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />

          {showOverflowTooltip && showTooltip && isOverflowing && hasValue && (
            <div className={styles.tooltip} role='tooltip'>
              {value}
            </div>
          )}
        </div>
      </FormField>
    );
  }
);

Input.displayName = 'Input';
