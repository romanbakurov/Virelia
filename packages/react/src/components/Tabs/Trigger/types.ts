import type { BaseTabsTriggerProps } from '@vellira-ui/types';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface TabsTriggerProps
  extends
    BaseTabsTriggerProps,
    Omit<
      ButtonHTMLAttributes<HTMLButtonElement>,
      'children' | 'disabled' | 'value'
    > {
  /** Trigger label content. */
  children?: ReactNode;
  /** Icon rendered before the trigger label. */
  icon?: ReactNode;
  /** Badge content rendered with the trigger label. */
  badge?: ReactNode;
  /** Supporting text rendered below the trigger label. */
  description?: ReactNode;
}

export interface TabsSlotProps {
  /** Slot content. */
  children: ReactNode;
  /** Class name applied to the slot element. */
  className?: string;
}
