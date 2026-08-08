export type {
  OverlayDiagnostics,
  OverlayStackEntry,
  OverlayZIndexPolicy,
} from './policy.js';
export {
  createConsoleOverlayDiagnostics,
  createOverlayStack,
  createOverlayZIndexPolicy,
  getTopOverlay,
  OVERLAY_STACK_ORDER_STEP,
  resolveOverlayZIndex,
} from './policy.js';
export type { OverlayDismissOptions, ScrollLockOptions } from './types.js';
