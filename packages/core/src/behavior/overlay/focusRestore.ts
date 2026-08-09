import { createAutoFocusEvent } from '../utils/events.js';
import type { OverlayAutoFocusEvent } from '../utils/types.js';

export type RunOverlayCloseAutoFocusOptions = {
  enabled: boolean;
  event?: OverlayAutoFocusEvent;
  onCloseAutoFocus?: (event: OverlayAutoFocusEvent) => void;
};

export function runOverlayCloseAutoFocus({
  enabled,
  event,
  onCloseAutoFocus,
}: RunOverlayCloseAutoFocusOptions) {
  if (!enabled) return false;

  const closeEvent = event ?? createAutoFocusEvent();

  onCloseAutoFocus?.(closeEvent);

  return !closeEvent.defaultPrevented;
}

export function deferOverlayFocusRestore(
  restoreFocus: () => void,
  schedule: (callback: () => void) => void = queueMicrotask
) {
  schedule(restoreFocus);
}
