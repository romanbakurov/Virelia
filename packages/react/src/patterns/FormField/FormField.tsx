import {
  type AriaAttributes,
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useId,
} from 'react';

import { FormFieldContext } from './FormFieldContext';
import type {
  FormFieldControlProps,
  FormFieldDescriptionProps,
  FormFieldLabelProps,
  FormFieldMessageProps,
  FormFieldProps,
} from './types';

import styles from './FormField.module.scss';

import { cn } from '#utils/cn';

type FieldControlProps = AriaAttributes & {
  id?: string;
  required?: boolean;
  disabled?: boolean;
};

type FormFieldSlot = 'label' | 'description' | 'control' | 'message';
type FormFieldSlotComponent<TProps> = ((
  props: TProps
) => ReactElement | null) & {
  __velliraFormFieldPart?: FormFieldSlot;
  displayName?: string;
};

type ParsedFormFieldChildren = {
  hasSlots: boolean;
  label?: FormFieldLabelProps;
  description?: FormFieldDescriptionProps;
  control?: FormFieldControlProps;
  message?: FormFieldMessageProps;
  fallbackChildren?: ReactNode;
};

const mergeIds = (...ids: Array<string | undefined>) =>
  ids.filter(Boolean).join(' ') || undefined;

function createFormFieldSlot<TProps extends object>(
  name: FormFieldSlot,
  displayName: string
) {
  const Slot: FormFieldSlotComponent<TProps> = () => null;
  Slot.__velliraFormFieldPart = name;
  Slot.displayName = displayName;
  return Slot;
}

function parseFormFieldChildren(children: ReactNode): ParsedFormFieldChildren {
  const fallbackChildren: ReactNode[] = [];
  const parsed: ParsedFormFieldChildren = { hasSlots: false };

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      if (child !== null && child !== undefined && child !== false) {
        fallbackChildren.push(child);
      }
      return;
    }

    const type = child.type as FormFieldSlotComponent<unknown>;

    switch (type.__velliraFormFieldPart) {
      case 'label':
        parsed.hasSlots = true;
        parsed.label = child.props as FormFieldLabelProps;
        return;

      case 'description':
        parsed.hasSlots = true;
        parsed.description = child.props as FormFieldDescriptionProps;
        return;

      case 'control':
        parsed.hasSlots = true;
        parsed.control = child.props as FormFieldControlProps;
        return;

      case 'message':
        parsed.hasSlots = true;
        parsed.message = child.props as FormFieldMessageProps;
        return;

      default:
        fallbackChildren.push(child);
    }
  });

  if (fallbackChildren.length > 0) {
    parsed.fallbackChildren =
      fallbackChildren.length === 1 ? fallbackChildren[0] : fallbackChildren;
  }

  return parsed;
}

const FormFieldRoot = ({
  id,
  label,
  description,
  error,
  message,
  messageTone,
  messageLive,
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
  const parsedChildren = parseFormFieldChildren(children);
  const resolvedLabel = label ?? parsedChildren.label?.children;
  const resolvedDescription =
    description ?? parsedChildren.description?.children;
  const resolvedMessage = message ?? parsedChildren.message?.children;
  const resolvedMessageTone =
    messageTone ?? parsedChildren.message?.tone ?? 'neutral';
  const resolvedMessageLive =
    messageLive ?? parsedChildren.message?.live ?? 'off';
  const resolvedLabelInfo = labelInfo ?? parsedChildren.label?.info;
  const resolvedLabelAction = labelAction ?? parsedChildren.label?.action;
  const resolvedOptionalText =
    optionalText ?? parsedChildren.label?.optionalText;
  const resolvedChildren = parsedChildren.hasSlots
    ? (parsedChildren.control?.children ?? parsedChildren.fallbackChildren)
    : children;
  const resolvedBindControl =
    parsedChildren.control?.bindControl ?? bindControl;

  const generatedId = useId();
  const controlId = id ?? generatedId;
  const labelId = resolvedLabel ? `${controlId}-label` : undefined;
  const descriptionId =
    resolvedDescription && controlId ? `${controlId}-description` : undefined;

  const errorId = error && controlId ? `${controlId}-error` : undefined;
  const messageId =
    !error && resolvedMessage && controlId ? `${controlId}-message` : undefined;
  const isInvalid = invalid || Boolean(error);
  const visibleMessage = error ?? resolvedMessage;
  const visibleTone = error ? 'danger' : resolvedMessageTone;
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
    isValidElement<FieldControlProps>(resolvedChildren) &&
    resolvedChildren.type !== Fragment
      ? (resolvedChildren as ReactElement<FieldControlProps>)
      : undefined;
  const control =
    resolvedBindControl && child
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
      : resolvedChildren;

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
      {(resolvedLabel || resolvedLabelAction) && (
        <div className={styles.labelRow}>
          {resolvedLabel && (
            <label
              id={labelId}
              htmlFor={controlId}
              className={cn(
                styles.label,
                parsedChildren.label?.className,
                labelClassName
              )}
            >
              <span className={styles.labelText}>{resolvedLabel}</span>

              {required && (
                <span className={styles.required} aria-hidden='true'>
                  *
                </span>
              )}

              {!required && resolvedOptionalText && (
                <span className={styles.optional}>{resolvedOptionalText}</span>
              )}

              {resolvedLabelInfo && (
                <span className={styles.labelInfo}>{resolvedLabelInfo}</span>
              )}
            </label>
          )}

          {resolvedLabelAction && (
            <div className={styles.labelAction}>{resolvedLabelAction}</div>
          )}
        </div>
      )}

      {resolvedDescription && (
        <div
          id={descriptionId}
          className={cn(
            styles.description,
            parsedChildren.description?.className,
            descriptionClassName
          )}
        >
          {resolvedDescription}
        </div>
      )}

      <FormFieldContext.Provider value={contextValue}>
        <div
          className={cn(
            styles.control,
            parsedChildren.control?.className,
            controlClassName
          )}
        >
          {control}
        </div>
      </FormFieldContext.Provider>

      {visibleMessage && (
        <div
          id={error ? errorId : messageId}
          className={cn(
            styles.message,
            messageToneClassName,
            !error && parsedChildren.message?.className,
            error ? errorClassName : messageClassName
          )}
          role={error ? 'alert' : undefined}
          aria-live={
            !error && resolvedMessageLive === 'polite' ? 'polite' : undefined
          }
        >
          {visibleMessage}
        </div>
      )}
    </div>
  );
};

const FormFieldLabel = createFormFieldSlot<FormFieldLabelProps>(
  'label',
  'FormField.Label'
);
const FormFieldDescription = createFormFieldSlot<FormFieldDescriptionProps>(
  'description',
  'FormField.Description'
);
const FormFieldControl = createFormFieldSlot<FormFieldControlProps>(
  'control',
  'FormField.Control'
);
const FormFieldMessage = createFormFieldSlot<FormFieldMessageProps>(
  'message',
  'FormField.Message'
);

export const FormField = Object.assign(FormFieldRoot, {
  Label: FormFieldLabel,
  Description: FormFieldDescription,
  Control: FormFieldControl,
  Message: FormFieldMessage,
  displayName: 'FormField',
});
