import type {
  Orientation,
  TabsActivationMode,
  TabsColor,
  TabsSize,
  TabsValue,
  TabsVariant,
} from '@vellira-ui/types';
import type { KeyboardEvent } from 'react';

export interface RegisteredTab {
  value: TabsValue;
  element: HTMLButtonElement;
  disabled: boolean;
}

export interface RegisteredContent {
  value: TabsValue;
}

export interface TabsContextValue {
  value?: TabsValue;
  focusedValue?: TabsValue;
  setValue: (value: TabsValue) => void;
  setFocusedValue: (value: TabsValue) => void;

  orientation: Orientation;
  activationMode: TabsActivationMode;
  dir: 'ltr' | 'rtl';
  loop: boolean;

  variant: TabsVariant;
  color: TabsColor;
  size: TabsSize;

  keepMounted: boolean;
  lazyMount: boolean;
  disabled: boolean;

  registerTrigger: (
    value: TabsValue,
    element: HTMLButtonElement | null,
    disabled?: boolean
  ) => void;
  registerContent: (value: TabsValue, mounted: boolean) => void;

  onTriggerKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;

  getTriggerId: (value: TabsValue) => string;
  getContentId: (value: TabsValue) => string;
}
