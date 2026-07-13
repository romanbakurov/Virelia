import { cn } from '@utils/cn';
import { ChevronDown } from '@vellira-ui/icons';

import type { SelectTriggerProps } from './types';

import styles from './SelectTrigger.module.scss';

export const SelectTrigger = ({
  id,
  errorId,
  isOpen,
  disabled,
  required,
  listboxId,
  activeIndex,
  ariaLabel,
  error,
  displayText,
  isPlaceholder,
  size = 'md',
  className,
  buttonRef,
  onClick,
  onKeyDown,
  onBlur,
  onFocus,
}: SelectTriggerProps) => {
  return (
    <button
      id={id}
      ref={buttonRef}
      type='button'
      role='combobox'
      disabled={disabled}
      aria-disabled={disabled || undefined}
      aria-required={required || undefined}
      aria-expanded={isOpen}
      aria-haspopup='listbox'
      aria-label={ariaLabel}
      aria-invalid={error || undefined}
      aria-controls={isOpen ? listboxId : undefined}
      aria-describedby={errorId}
      aria-activedescendant={
        isOpen && activeIndex >= 0
          ? `${listboxId}-option-${activeIndex}`
          : undefined
      }
      className={cn(
        styles.control,
        styles[size],
        {
          [styles.error]: !!error,
          [styles.disabled]: disabled,
        },
        className
      )}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      onFocus={onFocus}
    >
      <span
        className={cn(styles.value, {
          [styles.placeholder]: isPlaceholder,
        })}
      >
        {displayText}
      </span>

      <span
        className={cn(styles.arrow, {
          [styles.open]: isOpen,
        })}
        aria-hidden='true'
      >
        <ChevronDown />
      </span>
    </button>
  );
};

SelectTrigger.displayName = 'SelectTrigger';
