import type { PopoverOpenChangeDetails } from '@vellira-ui/types';
import type { MutableRefObject } from 'react';

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

  setOpen: (open: boolean, details: PopoverOpenChangeDetails) => void;
}
