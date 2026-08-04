import type { Placement } from '@floating-ui/react';
import type { PopoverOpenChangeDetails } from '@vellira-ui/types';
import type { CSSProperties, MutableRefObject } from 'react';

export interface PopoverContextValue {
  open: boolean;
  modal: boolean;

  triggerRef: MutableRefObject<HTMLElement | null>;
  anchorRef: MutableRefObject<HTMLElement | null>;
  contentRef: MutableRefObject<HTMLElement | null>;

  triggerId: string;
  contentId: string;
  titleId: string;
  descriptionId: string;

  placement: Placement;
  floatingStyles: CSSProperties;
  isPositioned: boolean;

  setReferenceRef: (node: HTMLElement | null) => void;
  setContentRef: (node: HTMLElement | null) => void;

  portal: boolean;

  setOpen: (open: boolean, details: PopoverOpenChangeDetails) => void;
}
