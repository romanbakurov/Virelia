import { describe, expect, it, vi } from 'vitest';

import { createOverlayManager } from './WebOverlayManager';

describe('WebOverlayManager', () => {
  it('registers overlays in stable stack order and exposes the topmost entry', () => {
    const manager = createOverlayManager();

    manager.register({ id: 'popover', layer: 'popover' });
    manager.register({ id: 'dropdown', layer: 'dropdown' });

    expect(manager.getStack().map((entry) => entry.id)).toEqual([
      'popover',
      'dropdown',
    ]);
    expect(manager.getTopmost()?.id).toBe('dropdown');
    expect(manager.isTopmost('popover')).toBe(false);
    expect(manager.isTopmost('dropdown')).toBe(true);
  });

  it('moves an existing overlay to the top when it registers again', () => {
    const manager = createOverlayManager();

    manager.register({ id: 'first' });
    manager.register({ id: 'second' });
    manager.register({ id: 'first' });

    expect(manager.getStack().map((entry) => entry.id)).toEqual([
      'second',
      'first',
    ]);
    expect(manager.getTopmost()?.id).toBe('first');
  });

  it('removes overlays without disturbing the remaining order', () => {
    const manager = createOverlayManager();

    manager.register({ id: 'first' });
    manager.register({ id: 'second' });
    manager.register({ id: 'third' });
    manager.unregister('second');

    expect(manager.getStack().map((entry) => entry.id)).toEqual([
      'first',
      'third',
    ]);
    expect(manager.getTopmost()?.id).toBe('third');
  });

  it('calculates z-index from layer base and stack order unless explicitly set', () => {
    const manager = createOverlayManager();

    manager.register({ id: 'dropdown', layer: 'dropdown' });
    manager.register({ id: 'popover', layer: 'popover' });
    manager.register({ id: 'custom', layer: 'tooltip', zIndex: 5000 });

    expect(manager.getZIndex('dropdown')).toBe(100);
    expect(manager.getZIndex('popover')).toBe(210);
    expect(manager.getZIndex('custom')).toBe(5000);
  });

  it('notifies subscribers after stack changes', () => {
    const manager = createOverlayManager();
    let calls = 0;
    const unsubscribe = manager.subscribe(() => {
      calls += 1;
    });

    manager.register({ id: 'first' });
    manager.unregister('first');
    unsubscribe();
    manager.register({ id: 'second' });

    expect(calls).toBe(2);
  });

  it('dispatches Escape only to the topmost overlay handler', () => {
    const manager = createOverlayManager();
    const first = vi.fn();
    const second = vi.fn();
    const event = new KeyboardEvent('keydown', { key: 'Escape' });

    manager.register({ id: 'first' });
    manager.registerEscapeHandler('first', first);
    manager.register({ id: 'second' });
    manager.registerEscapeHandler('second', second);

    expect(manager.dispatchEscapeKeyDown(event)).toBe(true);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith(event);
  });

  it('dispatches Escape to the next overlay after the topmost unregisters', () => {
    const manager = createOverlayManager();
    const first = vi.fn();
    const second = vi.fn();
    const event = new KeyboardEvent('keydown', { key: 'Escape' });

    manager.register({ id: 'first' });
    manager.registerEscapeHandler('first', first);
    manager.register({ id: 'second' });
    manager.registerEscapeHandler('second', second);
    manager.unregister('second');

    expect(manager.dispatchEscapeKeyDown(event)).toBe(true);
    expect(first).toHaveBeenCalledWith(event);
    expect(second).not.toHaveBeenCalled();
  });

  it('does not dispatch Escape to lower overlays when the topmost has no handler', () => {
    const manager = createOverlayManager();
    const first = vi.fn();
    const event = new KeyboardEvent('keydown', { key: 'Escape' });

    manager.register({ id: 'first' });
    manager.registerEscapeHandler('first', first);
    manager.register({ id: 'second' });

    expect(manager.dispatchEscapeKeyDown(event)).toBe(false);
    expect(first).not.toHaveBeenCalled();
  });

  it('dispatches pointer down outside only to the topmost overlay handler', () => {
    const manager = createOverlayManager();
    const first = vi.fn();
    const second = vi.fn();
    const event = new PointerEvent('pointerdown', { bubbles: true });

    manager.register({ id: 'first' });
    manager.registerPointerDownOutsideHandler('first', first);
    manager.register({ id: 'second' });
    manager.registerPointerDownOutsideHandler('second', second);

    expect(manager.dispatchPointerDownOutside(event)).toBe(true);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith(event);
  });

  it('does not dispatch pointer down outside to lower overlays when the topmost has no handler', () => {
    const manager = createOverlayManager();
    const first = vi.fn();
    const event = new PointerEvent('pointerdown', { bubbles: true });

    manager.register({ id: 'first' });
    manager.registerPointerDownOutsideHandler('first', first);
    manager.register({ id: 'second' });

    expect(manager.dispatchPointerDownOutside(event)).toBe(false);
    expect(first).not.toHaveBeenCalled();
  });
});
