import type { BaseTabsTriggerProps } from '@vellira-ui/types';
import type {
  ButtonHTMLAttributes,
  MouseEventHandler,
  ReactNode,
  Ref,
} from 'react';

export interface TabsTriggerChildProps {
  children?: ReactNode;
  id?: string;
  className?: string;
  href?: string;
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | boolean;
  'aria-disabled'?: boolean;
  'data-state'?: 'active' | 'inactive';
  'data-disabled'?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  ref?: Ref<HTMLElement>;
  tabIndex?: number;
}

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
