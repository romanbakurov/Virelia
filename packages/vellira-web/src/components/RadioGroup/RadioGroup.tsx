import { forwardRef, useId } from 'react';

import { FormField } from '@patterns/FormField';
import { useControllableState } from '@romanbakurov/vellira-core';
import { cn } from '@utils/cn';

import type { RadioGroupProps } from './types';

import styles from './RadioGroup.module.scss';

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
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
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const fieldId = id ?? generatedId;

    const groupId = `${fieldId}-group`;
    const radioName = name ?? groupId;
    const descriptionId = description ? `${fieldId}-description` : undefined;
    const errorId = error ? `${fieldId}-error` : undefined;
    const describedBy =
      [descriptionId, errorId].filter(Boolean).join(' ') || undefined;

    const [selectedValue, setSelectedValue] = useControllableState({
      value,
      defaultValue: defaultValue ?? '',
      onChange,
    });

    return (
      <FormField
        id={fieldId}
        label={label}
        description={description}
        required={required}
        disabled={disabled}
        error={error}
      >
        <div
          {...props}
          ref={ref}
          id={groupId}
          className={cn(styles.group, styles[orientation], className)}
          role='radiogroup'
          aria-required={required || undefined}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy}
        >
          {options.map((option) => {
            const optionId = `${fieldId}-${option.value}`;
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
                  name={radioName}
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
  }
);

RadioGroup.displayName = 'RadioGroup';
