import { AccessibilityInfo } from 'react-native';

import type { ResolveSelectAccessibilityParams } from './types';

export const resolveSelectAccessibility = ({
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
}: ResolveSelectAccessibilityParams) => {
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
