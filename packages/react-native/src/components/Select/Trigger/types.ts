import type { SelectColor, SelectSize, SelectVariant } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import type { SelectIconElement } from '../types';

export interface SelectTriggerProps {
  displayText: ReactNode;
  isPlaceholder: boolean;
  isOpen: boolean;
  size?: SelectSize;
  color?: SelectColor;
  variant?: SelectVariant;
  disabled?: boolean;
  required?: boolean;
  hasError?: boolean;
  hasValue?: boolean;
  loading?: boolean;
  clearable?: boolean;
  startIcon?: SelectIconElement;
  endIcon?: SelectIconElement;
  prefix?: ReactNode;
  suffix?: ReactNode;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  nativeID?: string;
  accessibilityLabelledBy?: string;
  ariaDescribedBy?: string;
  triggerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress: () => void;
  onClear?: () => void;
}
