export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';

export type PopoverAlign = 'start' | 'center' | 'end';

export type PopoverSize = 'sm' | 'md' | 'lg' | 'auto';

export type PopoverOpenChangeReason =
  'trigger' | 'close' | 'escape-key' | 'outside-press' | 'programmatic';

export interface PopoverOpenChangeDetails {
  reason: PopoverOpenChangeReason;
  event?: Event;
}

export interface BasePopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  modal?: boolean;
  onOpenChange?: (open: boolean, details: PopoverOpenChangeDetails) => void;
}

export interface BasePopoverPositioningProps {
  side?: PopoverSide;
  align?: PopoverAlign;
  sideOffset?: number;
  alignOffset?: number;
  collisionPadding?: number;
  avoidCollisions?: boolean;
  hideWhenDetached?: boolean;
}
