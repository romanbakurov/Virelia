import { forwardRef, useId } from 'react';

import type { ChangeEvent } from 'react';

import { useRadioGroupContext } from '../../components/RadioGroup/internal/RadioGroupContext';

import type { RadioProps } from './types';

import styles from './Radio.module.scss';

import { useControllableState } from '#hooks';
import { cn } from '#utils/cn';

const colorClassNameByColor = {
  primary: styles.colorPrimary,
  neutral: styles.colorNeutral,
  success: styles.colorSuccess,
  warning: styles.colorWarning,
  danger: styles.colorDanger,
} as const;

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      value,
      checked,
      defaultChecked = false,
      disabled: disabledProp = false,
      required: requiredProp = false,
      size: sizeProp,
      color: colorProp,
      error,
      onCheckedChange,
      label,
      description,
      icon,
      wrapperClassName,
      className,
      id,
      name,
      'aria-describedby': ariaDescribedBy,
      ...rest
    },
    ref
  ) => {
    const group = useRadioGroupContext();

    const generatedId = useId();
    const radioId = id ?? generatedId;

    const descriptionId = description ? `${radioId}-description` : undefined;
    const errorId = error ? `${radioId}-error` : undefined;

    const describedBy =
      [descriptionId, errorId, group?.describedBy, ariaDescribedBy]
        .filter(Boolean)
        .join(' ') || undefined;

    const isInsideGroup = group !== null;

    const [standaloneChecked, setStandaloneChecked] = useControllableState({
      value: checked,
      defaultValue: defaultChecked,
      onChange: onCheckedChange,
    });

    const resolvedChecked = isInsideGroup
      ? group.value === value
      : standaloneChecked;

    const resolvedDisabled = Boolean(group?.disabled) || disabledProp;
    const resolvedRequired = Boolean(group?.required) || requiredProp;
    const resolvedName = group?.name ?? name;
    const resolvedInvalid = Boolean(error || group?.invalid);
    const resolvedSize = sizeProp ?? group?.size ?? 'md';
    const resolvedColor = colorProp ?? group?.color ?? 'primary';

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (resolvedDisabled) {
        return;
      }

      if (isInsideGroup) {
        group.onValueChange(value);
        return;
      }

      setStandaloneChecked(event.currentTarget.checked);
    };

    return (
      <div
        className={cn(
          styles.root,
          styles[resolvedSize],
          resolvedInvalid && styles.invalid,
          resolvedDisabled && styles.disabled,
          colorClassNameByColor[resolvedColor],
          className
        )}
      >
        <label
          htmlFor={radioId}
          className={cn(styles.wrapper, wrapperClassName)}
        >
          <input
            {...rest}
            ref={ref}
            id={radioId}
            type='radio'
            name={resolvedName}
            value={value}
            checked={resolvedChecked}
            disabled={resolvedDisabled}
            required={resolvedRequired}
            aria-invalid={resolvedInvalid || undefined}
            aria-describedby={describedBy}
            className={styles.input}
            onChange={handleChange}
          />

          <span className={styles.control} aria-hidden='true'>
            <span className={cn(styles.indicator, icon && styles.customIcon)}>
              {icon}
            </span>
          </span>

          {(label || description) && (
            <span className={styles.content}>
              {label && <span className={styles.label}>{label}</span>}

              {description && (
                <span id={descriptionId} className={styles.description}>
                  {description}
                </span>
              )}
            </span>
          )}
        </label>

        {error && (
          <div id={errorId} className={styles.error}>
            {error}
          </div>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
