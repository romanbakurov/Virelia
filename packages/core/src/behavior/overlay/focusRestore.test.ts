import { describe, expect, it, vi } from 'vitest';

import {
  deferOverlayFocusRestore,
  runOverlayCloseAutoFocus,
} from './focusRestore.js';

describe('overlay focus restore utilities', () => {
  it('runs close auto focus and allows restore when not prevented', () => {
    const onCloseAutoFocus = vi.fn();

    expect(runOverlayCloseAutoFocus({ enabled: true, onCloseAutoFocus })).toBe(
      true
    );
    expect(onCloseAutoFocus).toHaveBeenCalledTimes(1);
  });

  it('blocks restore when disabled or prevented', () => {
    expect(runOverlayCloseAutoFocus({ enabled: false })).toBe(false);
    expect(
      runOverlayCloseAutoFocus({
        enabled: true,
        onCloseAutoFocus: (event) => event.preventDefault(),
      })
    ).toBe(false);
  });

  it('defers restore through the provided scheduler', () => {
    const restore = vi.fn();
    const schedule = vi.fn((callback: () => void) => callback());

    deferOverlayFocusRestore(restore, schedule);

    expect(schedule).toHaveBeenCalledWith(restore);
    expect(restore).toHaveBeenCalledTimes(1);
  });
});
