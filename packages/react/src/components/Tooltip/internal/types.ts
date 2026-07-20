import type { Placement } from '@floating-ui/react';
import type {
  CSSProperties,
  HTMLAttributes,
  MutableRefObject,
  RefCallback,
  RefObject,
} from 'react';

export type TooltipDelayConfig = {
  open: number;
  close: number;
};

export type TooltipContextValue = {
  contentId: string;
  open: boolean;
  disabled: boolean;
  interactive: boolean;
  contentRef: RefObject<HTMLDivElement | null>;
  arrowRef: MutableRefObject<HTMLDivElement | null>;
  arrowX?: number | null;
  arrowY?: number | null;
  placement: Placement;
  floatingStyles: CSSProperties;
  setOpen: (open: boolean) => void;
  setTriggerRef: RefCallback<HTMLElement>;
  setContentRef: RefCallback<HTMLDivElement>;
  getTriggerProps: (
    userProps?: HTMLAttributes<HTMLElement>
  ) => HTMLAttributes<HTMLElement>;
  getContentProps: (
    userProps?: HTMLAttributes<HTMLElement>
  ) => HTMLAttributes<HTMLElement>;
};
