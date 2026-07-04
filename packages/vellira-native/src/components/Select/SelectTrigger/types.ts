import type {
  PressableProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import type { SelectSize } from '../types';

export interface SelectTriggerProps extends Omit<
  PressableProps,
  'children' | 'disabled' | 'onPress' | 'style'
> {
  displayText: string;
  size?: SelectSize;
  isPlaceholder: boolean;
  isOpen: boolean;
  disabled?: boolean;
  hasError?: boolean;
  accessibilityLabel?: string;
  triggerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress: () => void;
}
