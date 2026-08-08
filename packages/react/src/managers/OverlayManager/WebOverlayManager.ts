import {
  createConsoleOverlayDiagnostics,
  createOverlayLayerPolicy,
  createOverlayStack,
  getTopOverlay,
  resolveOverlayZIndex,
} from '@vellira-ui/core';
import { lightTheme } from '@vellira-ui/tokens';

import type {
  OverlayEntry,
  OverlayEscapeHandler,
  OverlayLayer,
  OverlayManager,
  OverlayPointerDownOutsideHandler,
  OverlayRegistration,
  OverlaySnapshot,
} from './types';

const overlayLayerPolicy = createOverlayLayerPolicy<OverlayLayer>({
  defaultLayer: 'popover',
  layers: lightTheme.tokens.zIndex,
});
const overlayDiagnostics = createConsoleOverlayDiagnostics('WebOverlayManager');

function cloneRegistry(registry: Map<string, OverlayEntry>) {
  return new Map(
    Array.from(registry.entries()).map(([id, entry]) => [id, { ...entry }])
  );
}

function createSnapshot(registry: Map<string, OverlayEntry>): OverlaySnapshot {
  const stack = createOverlayStack(registry.values());

  return {
    registry: cloneRegistry(registry),
    stack,
    topmost: getTopOverlay(stack),
  };
}

export function createOverlayManager(): OverlayManager {
  const registry = new Map<string, OverlayEntry>();
  const escapeHandlers = new Map<string, OverlayEscapeHandler>();
  const pointerDownOutsideHandlers = new Map<
    string,
    OverlayPointerDownOutsideHandler
  >();
  const listeners = new Set<() => void>();
  let orderSeed = 0;
  let snapshot = createSnapshot(registry);

  const emit = () => {
    snapshot = createSnapshot(registry);
    listeners.forEach((listener) => listener());
  };

  const resolveZIndex = (entry: OverlayEntry) => {
    return resolveOverlayZIndex({
      explicitZIndex: entry.zIndex,
      layer: entry.layer,
      order: entry.order,
      policy: overlayLayerPolicy,
    });
  };

  return {
    register(registration: OverlayRegistration) {
      if (registry.has(registration.id)) {
        overlayDiagnostics.duplicateRegistration?.(registration.id);
      }

      registry.delete(registration.id);

      const entry = {
        id: registration.id,
        layer: registration.layer ?? overlayLayerPolicy.defaultLayer,
        order: orderSeed++,
        zIndex: registration.zIndex,
      };

      registry.set(registration.id, entry);
      emit();

      return entry;
    },

    unregister(id: string) {
      escapeHandlers.delete(id);
      pointerDownOutsideHandlers.delete(id);

      if (!registry.delete(id)) {
        overlayDiagnostics.unknownUnregister?.(id);
        return;
      }

      if (registry.size === 0) {
        orderSeed = 0;
      }

      emit();
    },

    update(registration: OverlayRegistration) {
      const current = registry.get(registration.id);

      if (!current) return null;

      const next = {
        ...current,
        layer: registration.layer ?? current.layer,
        zIndex: registration.zIndex,
      };

      registry.set(registration.id, next);
      emit();

      return next;
    },

    getSnapshot() {
      return snapshot;
    },

    getEntry(id: string) {
      return registry.get(id) ?? null;
    },

    getStack() {
      return snapshot.stack;
    },

    getTopmost() {
      return snapshot.topmost;
    },

    isTopmost(id: string) {
      return snapshot.topmost?.id === id;
    },

    getZIndex(id: string) {
      const entry = registry.get(id);

      return entry ? resolveZIndex(entry) : undefined;
    },

    registerEscapeHandler(id: string, handler: OverlayEscapeHandler) {
      escapeHandlers.set(id, handler);

      return () => {
        if (escapeHandlers.get(id) !== handler) return;

        escapeHandlers.delete(id);
      };
    },

    dispatchEscapeKeyDown(event: KeyboardEvent) {
      const topmost = snapshot.topmost;

      if (!topmost) return false;

      const handler = escapeHandlers.get(topmost.id);

      if (!handler) return false;

      handler(event);

      return true;
    },

    registerPointerDownOutsideHandler(
      id: string,
      handler: OverlayPointerDownOutsideHandler
    ) {
      pointerDownOutsideHandlers.set(id, handler);

      return () => {
        if (pointerDownOutsideHandlers.get(id) !== handler) return;

        pointerDownOutsideHandlers.delete(id);
      };
    },

    dispatchPointerDownOutside(event: PointerEvent) {
      const topmost = snapshot.topmost;

      if (!topmost) return false;

      const handler = pointerDownOutsideHandlers.get(topmost.id);

      if (!handler) return false;

      handler(event);

      return true;
    },

    subscribe(listener: () => void) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },

    clear() {
      if (registry.size === 0) return;

      registry.clear();
      escapeHandlers.clear();
      pointerDownOutsideHandlers.clear();
      orderSeed = 0;
      emit();
    },
  };
}

export const overlayManager = createOverlayManager();
