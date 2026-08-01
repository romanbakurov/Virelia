import {
  type AriaAttributes,
  cloneElement,
  Fragment,
  isValidElement,
  type ReactElement,
  useId,
} from 'react';

import { cn } from '@utils/cn';

import { FormFieldContext } from './FormFieldContext';
import type { FormFieldProps } from './types';

import styles from './FormField.module.scss';

type FieldControlProps = AriaAttributes & {
  id?: string;
  required?: boolean;
  disabled?: boolean;
};

const mergeIds = (...ids: Array<string | undefined>) =>
  ids.filter(Boolean).join(' ') || undefined;

export const FormField = ({
  id,
  label,
  description,
  error,
  message,
  messageTone = 'neutral',
  messageLive = 'off',
  required = false,
  disabled = false,
  invalid = false,
  orientation = 'vertical',
  labelPosition = 'top',
  size = 'md',
  labelInfo,
  labelAction,
  optionalText,
  children,
  bindControl = true,
  className,
  controlClassName,
  labelClassName,
  descriptionClassName,
  errorClassName,
  messageClassName,
  ...rest
}: FormFieldProps) => {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const labelId = label ? `${controlId}-label` : undefined;
  const descriptionId =
    description && controlId ? `${controlId}-description` : undefined;

  const errorId = error && controlId ? `${controlId}-error` : undefined;
  const messageId =
    !error && message && controlId ? `${controlId}-message` : undefined;
  const isInvalid = invalid || Boolean(error);
  const visibleMessage = error ?? message;
  const visibleTone = error ? 'danger' : messageTone;
  const messageToneClassName = {
    neutral: styles.messageToneNeutral,
    success: styles.messageToneSuccess,
    warning: styles.messageToneWarning,
    danger: styles.messageToneDanger,
  }[visibleTone];
  const labelledBy = mergeIds(labelId);
  const describedBy = mergeIds(descriptionId, errorId, messageId);
  const contextValue = {
    controlId,
    labelId,
    descriptionId,
    errorId,
    messageId,
    required,
    disabled,
    invalid: isInvalid,
    size,
    ariaLabelledBy: labelledBy,
    ariaDescribedBy: describedBy,
  };

  const child =
    isValidElement<FieldControlProps>(children) && children.type !== Fragment
      ? (children as ReactElement<FieldControlProps>)
      : undefined;
  const control =
    bindControl && child
      ? cloneElement(child, {
          id: child.props.id ?? controlId,
          required: child.props.required ?? required,
          disabled: child.props.disabled ?? disabled,
          'aria-invalid':
            child.props['aria-invalid'] ?? (isInvalid || undefined),
          'aria-labelledby': mergeIds(
            child.props['aria-labelledby'],
            labelledBy
          ),
          'aria-describedby': mergeIds(
            child.props['aria-describedby'],
            describedBy
          ),
        })
      : children;

  return (
    <div
      {...rest}
      aria-disabled={disabled || undefined}
      className={cn(
        styles.wrapper,
        styles[orientation],
        styles[labelPosition],
        styles[size],
        disabled && styles.disabled,
        className
      )}
      data-disabled={disabled || undefined}
      data-invalid={isInvalid || undefined}
      data-orientation={orientation}
      data-size={size}
    >
      {(label || labelAction) && (
        <div className={styles.labelRow}>
          {label && (
            <label
              id={labelId}
              htmlFor={controlId}
              className={cn(styles.label, labelClassName)}
            >
              <span className={styles.labelText}>{label}</span>

              {required && (
                <span className={styles.required} aria-hidden='true'>
                  *
                </span>
              )}

              {!required && optionalText && (
                <span className={styles.optional}>{optionalText}</span>
              )}

              {labelInfo && (
                <span className={styles.labelInfo}>{labelInfo}</span>
              )}
            </label>
          )}

          {labelAction && (
            <div className={styles.labelAction}>{labelAction}</div>
          )}
        </div>
      )}

      {description && (
        <div
          id={descriptionId}
          className={cn(styles.description, descriptionClassName)}
        >
          {description}
        </div>
      )}

      <FormFieldContext.Provider value={contextValue}>
        <div className={cn(styles.control, controlClassName)}>{control}</div>
      </FormFieldContext.Provider>

      {visibleMessage && (
        <div
          id={error ? errorId : messageId}
          className={cn(
            styles.message,
            messageToneClassName,
            error ? errorClassName : messageClassName
          )}
          role={error ? 'alert' : undefined}
          aria-live={!error && messageLive === 'polite' ? 'polite' : undefined}
        >
          {visibleMessage}
        </div>
      )}
    </div>
  );
};
