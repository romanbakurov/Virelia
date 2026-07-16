import type { BaseRadioProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type {
  PressableProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

export interface RadioProps
  extends
    BaseRadioProps,
    Omit<
      PressableProps,
      'accessibilityRole' | 'accessibilityState' | 'disabled' | 'onPress'
    > {
  label?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  error?: string;

  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
}
