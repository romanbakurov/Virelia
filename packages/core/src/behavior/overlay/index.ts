export type {
  OverlayDiagnostics,
  OverlayLayerPolicy,
  OverlayStackEntry,
} from './policy.js';
export {
  createConsoleOverlayDiagnostics,
  createOverlayLayerPolicy,
  createOverlayStack,
  getTopOverlay,
  OVERLAY_STACK_ORDER_STEP,
  resolveOverlayZIndex,
} from './policy.js';
export type { OverlayDismissOptions, ScrollLockOptions } from './types.js';
