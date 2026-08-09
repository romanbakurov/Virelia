export type { RunOverlayCloseAutoFocusOptions } from './focusRestore.js';
export {
  deferOverlayFocusRestore,
  runOverlayCloseAutoFocus,
} from './focusRestore.js';
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
export type { ResolveOverlayPresentationOptions } from './presentation.js';
export { resolveOverlayPresentation } from './presentation.js';
export type {
  CreateOverlayManagerStoreOptions,
  OverlayManagerStore,
  OverlayManagerStoreEntry,
  OverlayManagerStoreRegistration,
  OverlayManagerStoreSnapshot,
} from './store.js';
export { createOverlayManagerStore } from './store.js';
export type { OverlayDismissOptions, ScrollLockOptions } from './types.js';
