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
  buttonRef,
  onClick,
  onKeyDown,
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
      aria-controls={isOpen ? listboxId : undefined}
      aria-describedby={errorId}
      aria-activedescendant={
        isOpen && activeIndex >= 0
          ? `${listboxId}-option-${activeIndex}`
          : undefined
      }
      className={cn(styles.control, {
        [styles.error]: !!error,
        [styles.disabled]: disabled,
      })}
      onClick={onClick}
      onKeyDown={onKeyDown}
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
