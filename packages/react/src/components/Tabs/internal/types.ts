import type {
  Orientation,
  TabsActivationMode,
  TabsColor,
  TabsSize,
  TabsVariant,
} from '@vellira-ui/types';
import type { KeyboardEvent } from 'react';

export interface RegisteredTab {
  value: string;
  element: HTMLButtonElement;
  disabled: boolean;
}

export interface TabsContextValue {
  value?: string;
  setValue: (value: string) => void;

  orientation: Orientation;
  activationMode: TabsActivationMode;
  loop: boolean;

  variant: TabsVariant;
  color: TabsColor;
  size: TabsSize;

  keepMounted: boolean;
  lazyMount: boolean;

  registerTrigger: (
    value: string,
    element: HTMLButtonElement | null,
    disabled?: boolean
  ) => void;

  onTriggerKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;

  getTriggerId: (value: string) => string;
  getContentId: (value: string) => string;
}
