import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useId,
} from 'react';

import { Text, View } from 'react-native';

import { useTheme, useThemeStyles } from '../../theme';

import { createStyles } from './FormField.styles';
import { FormFieldContext } from './FormFieldContext';
import type {
  FormFieldControlProps,
  FormFieldDescriptionProps,
  FormFieldLabelProps,
  FormFieldMessageProps,
  FormFieldProps,
} from './types';

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

function FormFieldRoot({
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
  size = 'md',
  labelInfo,
  labelAction,
  optionalText,
  children,
  style,
  controlStyle,
  labelStyle,
  descriptionStyle,
  errorStyle,
  messageStyle,
  ...rest
}: FormFieldProps) {
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

  const { theme } = useTheme();
  const styles = useThemeStyles(createStyles);
  const sizeTokens = theme.components.formField.size[size];
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const labelId = resolvedLabel ? `${controlId}-label` : undefined;
  const descriptionId = resolvedDescription
    ? `${controlId}-description`
    : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const messageId =
    !error && resolvedMessage ? `${controlId}-message` : undefined;
  const isInvalid = invalid || Boolean(error);
  const visibleMessage = error ?? resolvedMessage;
  const visibleTone = error ? 'danger' : resolvedMessageTone;
  const contextValue = {
    controlId,
    labelId,
    descriptionId,
    errorId,
    messageId,
    description,
    error,
    message: resolvedMessage,
    required,
    disabled,
    invalid: isInvalid,
    size,
    ariaLabelledBy: labelId,
    ariaDescribedBy:
      [descriptionId, errorId, messageId].filter(Boolean).join(' ') ||
      undefined,
  };
  const messageToneStyle = {
    neutral: undefined,
    success: styles.messageSuccess,
    warning: styles.messageWarning,
    danger: styles.messageDanger,
  }[visibleTone];

  return (
    <View
      {...rest}
      accessibilityState={disabled ? { disabled: true } : undefined}
      style={[styles.root, { gap: sizeTokens.gap }, style]}
    >
      {(resolvedLabel || resolvedLabelAction) && (
        <View style={[styles.labelRow, { gap: sizeTokens.gap }]}>
          {resolvedLabel &&
            (typeof resolvedLabel === 'string' ||
            typeof resolvedLabel === 'number' ? (
              <Text
                style={[
                  styles.label,
                  {
                    fontSize: sizeTokens.labelFontSize,
                    lineHeight: sizeTokens.labelLineHeight,
                  },
                  disabled && styles.labelDisabled,
                  parsedChildren.label?.style,
                  labelStyle,
                ]}
              >
                {resolvedLabel}

                {required && (
                  <Text
                    style={styles.required}
                    accessible={false}
                    importantForAccessibility='no'
                  >
                    *
                  </Text>
                )}

                {!required && resolvedOptionalText && (
                  <Text
                    style={[
                      styles.optional,
                      {
                        fontSize: sizeTokens.optionalFontSize,
                        lineHeight: sizeTokens.optionalLineHeight,
                      },
                    ]}
                  >
                    {resolvedOptionalText}
                  </Text>
                )}

                {resolvedLabelInfo && (
                  <Text
                    style={[
                      styles.labelInfo,
                      {
                        fontSize: sizeTokens.labelInfoFontSize,
                        lineHeight: sizeTokens.labelInfoSize,
                      },
                    ]}
                  >
                    {resolvedLabelInfo}
                  </Text>
                )}
              </Text>
            ) : (
              <View style={styles.customLabel}>
                {resolvedLabel}

                {required && (
                  <Text
                    style={styles.required}
                    accessible={false}
                    importantForAccessibility='no'
                  >
                    *
                  </Text>
                )}

                {!required && resolvedOptionalText}
                {resolvedLabelInfo}
              </View>
            ))}

          {resolvedLabelAction && (
            <View style={styles.labelAction}>{resolvedLabelAction}</View>
          )}
        </View>
      )}

      {resolvedDescription &&
        (typeof resolvedDescription === 'string' ||
        typeof resolvedDescription === 'number' ? (
          <Text
            style={[
              styles.description,
              {
                fontSize: sizeTokens.descriptionFontSize,
                lineHeight: sizeTokens.descriptionLineHeight,
              },
              disabled && styles.descriptionDisabled,
              parsedChildren.description?.style,
              descriptionStyle,
            ]}
          >
            {resolvedDescription}
          </Text>
        ) : (
          resolvedDescription
        ))}

      <FormFieldContext.Provider value={contextValue}>
        <View
          style={[
            styles.control,
            { gap: sizeTokens.gap },
            parsedChildren.control?.style,
            controlStyle,
          ]}
        >
          {resolvedChildren}
        </View>
      </FormFieldContext.Provider>

      {visibleMessage &&
        (typeof visibleMessage === 'string' ||
        typeof visibleMessage === 'number' ? (
          <Text
            accessibilityLiveRegion={
              error || resolvedMessageLive === 'polite' ? 'polite' : undefined
            }
            style={[
              styles.message,
              {
                fontSize: sizeTokens.helperTextFontSize,
                lineHeight: sizeTokens.helperTextLineHeight,
              },
              messageToneStyle,
              disabled && styles.helperTextDisabled,
              !error && parsedChildren.message?.style,
              error ? errorStyle : messageStyle,
            ]}
          >
            {visibleMessage}
          </Text>
        ) : (
          <View
            accessibilityLiveRegion={
              error || resolvedMessageLive === 'polite' ? 'polite' : undefined
            }
          >
            {visibleMessage}
          </View>
        ))}
    </View>
  );
}

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
