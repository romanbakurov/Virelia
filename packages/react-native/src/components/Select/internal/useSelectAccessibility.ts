import type { ReactNode } from 'react';
import { AccessibilityInfo } from 'react-native';

type UseSelectAccessibilityParams = {
  accessibilityLabel?: string;
  accessibilityHint?: string;
  label?: string;
  description?: ReactNode;
  error?: ReactNode;
  invalid: boolean;
  placeholder: string;
  selectedLabel?: string;
  hasFieldContext: boolean;
  fieldDescribedBy?: string;
};

export const useSelectAccessibility = ({
  accessibilityLabel,
  accessibilityHint,
  label,
  description,
  error,
  invalid,
  placeholder,
  selectedLabel,
  hasFieldContext,
  fieldDescribedBy,
}: UseSelectAccessibilityParams) => {
  const descriptionText =
    typeof description === 'string' || typeof description === 'number'
      ? String(description)
      : undefined;
  const errorText =
    typeof error === 'string' || typeof error === 'number'
      ? String(error)
      : undefined;

  const resolvedLabel =
    accessibilityLabel ?? label ?? selectedLabel ?? placeholder ?? 'Select';

  const resolvedHint =
    accessibilityHint ??
    (invalid && errorText
      ? errorText
      : descriptionText
        ? descriptionText
        : hasFieldContext && fieldDescribedBy
          ? 'Opens a list of options'
          : undefined);

  return {
    resolvedLabel,
    resolvedHint,
    announce: (message: string) => {
      AccessibilityInfo.announceForAccessibility?.(message);
    },
  };
};
