import type { BaseSelectTriggerProps } from '@vellira-ui/types';
import type { KeyboardEvent, ReactNode, Ref } from 'react';

export interface SelectTriggerProps extends BaseSelectTriggerProps {
  displayText: ReactNode;
  isPlaceholder: boolean;
  id?: string;
  errorId?: string;
  listboxId: string;
  activeIndex: number;
  ariaLabel?: string;
  error?: boolean | string;
  onClick: () => void;
  buttonRef: Ref<HTMLButtonElement>;
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
}
