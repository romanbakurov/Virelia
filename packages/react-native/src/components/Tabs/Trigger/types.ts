import type { BaseTabsTriggerProps } from '@vellira-ui/types';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface TabsTriggerProps extends BaseTabsTriggerProps {
  /** Trigger label content. */
  children?: ReactNode;
  /** Icon rendered before the trigger label. */
  icon?: ReactNode;
  /** Badge content rendered with the trigger label. */
  badge?: ReactNode;
  /** Supporting text rendered below the trigger label. */
  description?: ReactNode;
  /** Style applied to the trigger container. */
  style?: StyleProp<ViewStyle>;
  /** Style applied to trigger text. */
  textStyle?: StyleProp<TextStyle>;
}

export interface TabsSlotProps {
  /** Slot content. */
  children: ReactNode;
  /** Style applied to the slot container. */
  style?: StyleProp<ViewStyle>;
}
