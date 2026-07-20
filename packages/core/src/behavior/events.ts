import type { OverlayAutoFocusEvent, OverlayOutsideEvent } from './types.js';

export const createAutoFocusEvent = (): OverlayAutoFocusEvent => {
  let defaultPrevented = false;

  return {
    preventDefault: () => {
      defaultPrevented = true;
    },
    get defaultPrevented() {
      return defaultPrevented;
    },
  };
};

export const createOutsideEvent = <TOriginalEvent>(
  originalEvent: TOriginalEvent
): OverlayOutsideEvent<TOriginalEvent> => {
  let defaultPrevented = false;

  return {
    originalEvent,
    preventDefault: () => {
      defaultPrevented = true;
    },
    get defaultPrevented() {
      return defaultPrevented;
    },
  };
};
