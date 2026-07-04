export type OverlayType =
  'dropdown' | 'popover' | 'tooltip' | 'modal' | 'toast';

export const OVERLAY_Z_INDEX = {
  dropdown: 1000,
  popover: 1050,
  modal: 1100,
  toast: 1200,
} as const;
