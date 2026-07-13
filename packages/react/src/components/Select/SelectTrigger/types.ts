import type { BaseSelectTriggerProps, SelectSize } from '@vellira-ui/types';
import type { FocusEventHandler, KeyboardEvent, ReactNode, Ref } from 'react';

export interface SelectTriggerProps extends BaseSelectTriggerProps {
  displayText: ReactNode;
  isPlaceholder: boolean;
  size?: SelectSize;
  id?: string;
  errorId?: string;
  listboxId: string;
  activeIndex: number;
  ariaLabel?: string;
  error?: boolean;
  className?: string;
  onClick: () => void;
  buttonRef: Ref<HTMLButtonElement>;
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
}
