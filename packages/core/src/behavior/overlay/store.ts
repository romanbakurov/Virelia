import {
  createOverlayStack,
  getTopOverlay,
  type OverlayDiagnostics,
  type OverlayStackEntry,
  type OverlayZIndexPolicy,
  resolveOverlayZIndex,
} from './policy.js';

export type OverlayManagerStoreEntry<TLevel extends string = string> =
  OverlayStackEntry & {
    zIndexLevel: TLevel;
    zIndex?: number;
  };

export type OverlayManagerStoreRegistration<TLevel extends string = string> = {
  id: string;
  zIndexLevel?: TLevel;
  zIndex?: number;
};

export type OverlayManagerStoreSnapshot<TLevel extends string = string> = {
  registry: ReadonlyMap<string, OverlayManagerStoreEntry<TLevel>>;
  stack: readonly OverlayManagerStoreEntry<TLevel>[];
  topmost: OverlayManagerStoreEntry<TLevel> | null;
};

export type OverlayManagerStore<TLevel extends string = string> = {
  register: (
    registration: OverlayManagerStoreRegistration<TLevel>
  ) => OverlayManagerStoreEntry<TLevel>;
  unregister: (id: string) => void;
  update: (
    registration: OverlayManagerStoreRegistration<TLevel>
  ) => OverlayManagerStoreEntry<TLevel> | null;
  getSnapshot: () => OverlayManagerStoreSnapshot<TLevel>;
  getEntry: (id: string) => OverlayManagerStoreEntry<TLevel> | null;
  getStack: () => readonly OverlayManagerStoreEntry<TLevel>[];
  getTopmost: () => OverlayManagerStoreEntry<TLevel> | null;
  isTopmost: (id: string) => boolean;
  getZIndex: (id: string) => number | undefined;
  subscribe: (listener: () => void) => () => void;
  clear: () => void;
};

export type CreateOverlayManagerStoreOptions<TLevel extends string = string> = {
  policy: OverlayZIndexPolicy<TLevel>;
  diagnostics?: OverlayDiagnostics;
};

function cloneRegistry<TLevel extends string>(
  registry: Map<string, OverlayManagerStoreEntry<TLevel>>
) {
  return new Map(
    Array.from(registry.entries()).map(([id, entry]) => [id, { ...entry }])
  );
}

function createSnapshot<TLevel extends string>(
  registry: Map<string, OverlayManagerStoreEntry<TLevel>>
): OverlayManagerStoreSnapshot<TLevel> {
  const stack = createOverlayStack(registry.values());

  return {
    registry: cloneRegistry(registry),
    stack,
    topmost: getTopOverlay(stack),
  };
}

export function createOverlayManagerStore<TLevel extends string>({
  diagnostics,
  policy,
}: CreateOverlayManagerStoreOptions<TLevel>): OverlayManagerStore<TLevel> {
  const registry = new Map<string, OverlayManagerStoreEntry<TLevel>>();
  const listeners = new Set<() => void>();
  let orderSeed = 0;
  let snapshot = createSnapshot(registry);

  const emit = () => {
    snapshot = createSnapshot(registry);
    listeners.forEach((listener) => listener());
  };

  const resolveZIndex = (entry: OverlayManagerStoreEntry<TLevel>) =>
    resolveOverlayZIndex({
      explicitZIndex: entry.zIndex,
      level: entry.zIndexLevel,
      order: entry.order,
      policy,
    });

  return {
    register(registration) {
      if (registry.has(registration.id)) {
        diagnostics?.duplicateRegistration?.(registration.id);
      }

      registry.delete(registration.id);

      const entry = {
        id: registration.id,
        zIndexLevel: registration.zIndexLevel ?? policy.defaultLevel,
        order: orderSeed++,
        zIndex: registration.zIndex,
      };

      registry.set(registration.id, entry);
      emit();

      return entry;
    },

    unregister(id) {
      if (!registry.delete(id)) {
        diagnostics?.unknownUnregister?.(id);
        return;
      }

      if (registry.size === 0) {
        orderSeed = 0;
      }

      emit();
    },

    update(registration) {
      const current = registry.get(registration.id);

      if (!current) return null;

      const next = {
        ...current,
        zIndexLevel: registration.zIndexLevel ?? current.zIndexLevel,
        zIndex: registration.zIndex,
      };

      registry.set(registration.id, next);
      emit();

      return next;
    },

    getSnapshot() {
      return snapshot;
    },

    getEntry(id) {
      return registry.get(id) ?? null;
    },

    getStack() {
      return snapshot.stack;
    },

    getTopmost() {
      return snapshot.topmost;
    },

    isTopmost(id) {
      return snapshot.topmost?.id === id;
    },

    getZIndex(id) {
      const entry = registry.get(id);

      return entry ? resolveZIndex(entry) : undefined;
    },

    subscribe(listener) {
      listeners.add(listener);

      return () => {
        listeners.delete(listener);
      };
    },

    clear() {
      if (registry.size === 0) return;

      registry.clear();
      orderSeed = 0;
      emit();
    },
  };
}
