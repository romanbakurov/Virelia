import type { SelectSize } from '@vellira-ui/types';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface SelectTriggerProps {
  displayText: string;
  isPlaceholder: boolean;
  isOpen: boolean;
  size?: SelectSize;
  disabled?: boolean;
  required?: boolean;
  hasError?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  triggerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress: () => void;
}
