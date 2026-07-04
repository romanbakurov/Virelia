import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface SelectTriggerProps {
  displayText: string;
  isPlaceholder: boolean;
  isOpen: boolean;
  disabled?: boolean;
  hasError?: boolean;
  accessibilityLabel?: string;
  triggerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress: () => void;
}
