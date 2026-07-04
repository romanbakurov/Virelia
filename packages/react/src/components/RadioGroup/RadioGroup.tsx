import { useId } from 'react';

import { FormField } from '@patterns/FormField';
import { cn } from '@utils/cn';
import { useControllableState } from '@vellira-ui/core';

import type { RadioGroupProps } from './types';

import styles from './RadioGroup.module.scss';

export const RadioGroup = ({
  label,
  description,
  value,
  defaultValue,
  onChange,
  options,
  name,
  required = false,
  disabled = false,
  error,
  className,
  orientation = 'vertical',
}: RadioGroupProps) => {
  const generatedId = useId();

  const groupId = `${generatedId}-group`;
  const descriptionId = description ? `${generatedId}-description` : undefined;
  const errorId = error ? `${generatedId}-error` : undefined;
  const describedBy =
    [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

  const [selectedValue, setSelectedValue] = useControllableState({
    value,
    defaultValue: defaultValue ?? '',
    onChange,
  });

  return (
    <FormField
      id={generatedId}
      label={label}
      description={description}
      required={required}
      disabled={disabled}
      error={error}
    >
      <div
        id={groupId}
        className={cn(styles.group, styles[orientation], className)}
        role='radiogroup'
        aria-required={required || undefined}
        aria-invalid={!!error || undefined}
        aria-describedby={describedBy}
      >
        {options.map((option) => {
          const optionId = `${generatedId}-${option.value}`;
          const isDisabled = disabled || option.disabled;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={cn(styles.option, {
                [styles.disabled]: isDisabled,
              })}
            >
              <input
                id={optionId}
                type='radio'
                name={name}
                value={option.value}
                checked={selectedValue === option.value}
                required={required}
                disabled={isDisabled}
                onChange={() => {
                  if (isDisabled) return;
                  setSelectedValue(option.value);
                }}
                className={styles.input}
              />

              <span className={styles.customRadio} aria-hidden='true' />
              <span className={styles.label}>{option.label}</span>
            </label>
          );
        })}
      </div>
    </FormField>
  );
};

RadioGroup.displayName = 'RadioGroup';
