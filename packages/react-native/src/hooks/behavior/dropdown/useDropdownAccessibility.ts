import { useEffect, useMemo } from 'react';

import { AccessibilityInfo } from 'react-native';

type UseDropdownAccessibilityParams = {
  accessibilityLabel?: string;
  label: unknown;
  open: boolean;
};

export const useDropdownAccessibility = ({
  accessibilityLabel,
  label,
  open,
}: UseDropdownAccessibilityParams) => {
  const menuAccessibilityLabel = useMemo(() => {
    if (accessibilityLabel) return accessibilityLabel;

    return typeof label === 'string' ? label : 'Menu';
  }, [accessibilityLabel, label]);

  useEffect(() => {
    if (!open) return;

    AccessibilityInfo.announceForAccessibility(
      `${menuAccessibilityLabel} opened`
    );
  }, [menuAccessibilityLabel, open]);

  return {
    menuAccessibilityLabel,
  };
};
