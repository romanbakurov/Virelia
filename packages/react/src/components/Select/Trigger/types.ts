import type {
  BaseSelectTriggerProps,
  SelectColor,
  SelectSize,
  SelectVariant,
} from '@vellira-ui/types';
import type { FocusEventHandler, KeyboardEvent, ReactNode, Ref } from 'react';

export interface SelectTriggerSlotProps {
  /** Custom trigger content. */
  children?: ReactNode;
  /** Class name applied to the trigger element. */
  className?: string;
}

export interface SelectTriggerProps extends BaseSelectTriggerProps {
  children?: ReactNode;
  displayText: ReactNode;
  isPlaceholder: boolean;
  size?: SelectSize;
  color: SelectColor;
  variant: SelectVariant;
  id?: string;
  describedBy?: string;
  labelledBy?: string;
  listboxId: string;
  activeIndex: number;
  ariaLabel?: string;
  error?: boolean;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  prefix?: ReactNode;
  suffix?: ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  className?: string;
  onClick: () => void;
  buttonRef: Ref<HTMLButtonElement>;
  onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
  onBlur?: FocusEventHandler<HTMLButtonElement>;
  onFocus?: FocusEventHandler<HTMLButtonElement>;
}
