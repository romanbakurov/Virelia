import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface DropdownTriggerProps {
  /** Composes trigger behavior onto a single child element. */
  asChild?: boolean;
  /** Visible trigger label when no custom trigger is provided. */
  label?: ReactNode;
  /** Custom trigger content. */
  trigger?: ReactNode;
  /** Trigger children. */
  children?: ReactNode;
  /** Icon rendered before the trigger label. */
  icon?: ReactNode;
  /** Icon rendered to indicate expanded state. */
  arrowIcon?: ReactNode;
  /** Shows or hides the trigger arrow icon. */
  showArrow?: boolean;

  /** Accessible name announced for the dropdown trigger. */
  accessibilityLabel?: string;
  /** Additional accessibility hint for the dropdown trigger. */
  accessibilityHint?: string;

  /** Style applied to the trigger container. */
  triggerStyle?: StyleProp<ViewStyle>;
  /** Receives the native trigger node for positioning. */
  triggerRef?: (node: unknown) => void;
}
