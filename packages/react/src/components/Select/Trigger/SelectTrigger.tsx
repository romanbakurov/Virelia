import { cn } from '@utils/cn';
import { ChevronDown, Close } from '@vellira-ui/icons';

import { useSelectContext } from '../internal/SelectContext';
import { markSelectSlot, type SelectSlotComponent } from '../internal/types';

import type { SelectTriggerProps, SelectTriggerSlotProps } from './types';

import styles from './SelectTrigger.module.scss';

export const SelectTrigger: SelectSlotComponent<SelectTriggerSlotProps> = ({
  children,
  className,
}) => {
  const { triggerProps } = useSelectContext();

  return (
    <SelectTriggerSurface
      {...triggerProps}
      className={[triggerProps.className, className].filter(Boolean).join(' ')}
    >
      {children}
    </SelectTriggerSurface>
  );
};

markSelectSlot(SelectTrigger, 'trigger');
SelectTrigger.displayName = 'Select.Trigger';

export const SelectTriggerSurface = ({
  children,
  id,
  describedBy,
  labelledBy,
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
  color,
  variant,
  loading,
  startIcon,
  endIcon,
  prefix,
  suffix,
  clearable,
  onClear,
  className,
  buttonRef,
  onClick,
  onKeyDown,
  onBlur,
  onFocus,
}: SelectTriggerProps) => {
  return (
    <span className={styles.root}>
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
        aria-labelledby={labelledBy}
        aria-invalid={error || undefined}
        aria-controls={isOpen ? listboxId : undefined}
        aria-describedby={describedBy}
        aria-activedescendant={
          isOpen && activeIndex >= 0
            ? `${listboxId}-option-${activeIndex}`
            : undefined
        }
        className={cn(
          styles.control,
          styles[size],
          styles[variant],
          styles[color],
          {
            [styles.error]: !!error,
            [styles.disabled]: disabled,
            [styles.loading]: loading,
            [styles.withClear]: clearable,
          },
          className
        )}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        onFocus={onFocus}
      >
        {children ?? (
          <>
            {startIcon && <span className={styles.adornment}>{startIcon}</span>}
            {prefix && <span className={styles.affix}>{prefix}</span>}

            <span className={styles.valueWrap}>
              <span
                className={cn(styles.value, {
                  [styles.placeholder]: isPlaceholder,
                })}
              >
                {displayText}
              </span>
            </span>

            {suffix && <span className={styles.affix}>{suffix}</span>}

            <span
              className={cn(styles.arrow, {
                [styles.open]: isOpen,
              })}
              aria-hidden='true'
            >
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                (endIcon ?? <ChevronDown />)
              )}
            </span>
          </>
        )}
      </button>

      {clearable && !children && (
        <button
          type='button'
          aria-label='Clear selection'
          className={styles.clear}
          onClick={(event) => {
            event.stopPropagation();
            onClear?.();
          }}
        >
          <Close />
        </button>
      )}
    </span>
  );
};

SelectTriggerSurface.displayName = 'SelectTriggerSurface';
