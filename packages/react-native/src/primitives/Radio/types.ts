import type { BaseRadioProps, RadioColor } from '@vellira-ui/types';
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
  /** Visible label rendered next to the control. */
  label?: ReactNode;
  /** Helper text rendered below the label. */
  description?: ReactNode;
  /** Custom indicator rendered for the checked state. */
  icon?: ReactNode;
  /** Selected radio color. */
  color?: RadioColor;
  /** Validation error rendered below the radio. */
  error?: string;

  /** Extra style for the root container. */
  containerStyle?: StyleProp<ViewStyle>;
  /** Extra label text style. */
  labelStyle?: StyleProp<TextStyle>;
  /** Extra description text style. */
  descriptionStyle?: StyleProp<TextStyle>;
  /** Extra error text style. */
  errorStyle?: StyleProp<TextStyle>;
}
