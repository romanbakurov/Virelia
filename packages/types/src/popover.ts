export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';

export type PopoverAlign = 'start' | 'center' | 'end';

export type PopoverSize = 'sm' | 'md' | 'lg' | 'auto';

export type PopoverOpenChangeReason =
  'trigger' | 'close' | 'escape-key' | 'outside-press' | 'programmatic';

export interface PopoverOpenChangeDetails {
  /** Interaction or state source that requested the open state change. */
  reason: PopoverOpenChangeReason;
  /** Native event associated with the open state change when available. */
  event?: Event;
}

export interface BasePopoverProps {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Uses modal interaction semantics while the popover is open. */
  modal?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean, details: PopoverOpenChangeDetails) => void;
}

export interface BasePopoverPositioningProps {
  /** Preferred side for popover content relative to the anchor. */
  side?: PopoverSide;
  /** Alignment along the chosen side. */
  align?: PopoverAlign;
  /** Distance between the anchor and popover content. */
  sideOffset?: number;
  /** Offset along the aligned edge. */
  alignOffset?: number;
  /** Padding used when avoiding viewport collisions. */
  collisionPadding?: number;
  /** Allows the popover to flip or shift to stay visible. */
  avoidCollisions?: boolean;
  /** Hides content when the anchor becomes detached from layout. */
  hideWhenDetached?: boolean;
}
