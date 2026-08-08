export const OVERLAY_STACK_ORDER_STEP = 10;

export type OverlayZIndexPolicy<TLevel extends string = string> = {
  defaultLevel: TLevel;
  levels: Record<TLevel, number>;
  orderStep: number;
};

export type OverlayStackEntry = {
  id: string;
  order: number;
};

export type OverlayDiagnostics = {
  duplicateRegistration?: (id: string) => void;
  unknownUnregister?: (id: string) => void;
};

export const createOverlayZIndexPolicy = <TLevel extends string>({
  defaultLevel,
  levels,
  orderStep = OVERLAY_STACK_ORDER_STEP,
}: {
  defaultLevel: TLevel;
  levels: Record<TLevel, number>;
  orderStep?: number;
}): OverlayZIndexPolicy<TLevel> => ({
  defaultLevel,
  levels,
  orderStep,
});

export const resolveOverlayZIndex = <TLevel extends string>({
  explicitZIndex,
  level,
  order,
  policy,
}: {
  explicitZIndex?: number;
  level: TLevel;
  order: number;
  policy: OverlayZIndexPolicy<TLevel>;
}) => explicitZIndex ?? policy.levels[level] + order * policy.orderStep;

export const createOverlayStack = <TEntry extends OverlayStackEntry>(
  entries: Iterable<TEntry>
) =>
  Array.from(entries)
    .sort((left, right) => left.order - right.order)
    .map((entry) => ({ ...entry }));

export const getTopOverlay = <TEntry extends OverlayStackEntry>(
  stack: readonly TEntry[]
) => stack[stack.length - 1] ?? null;

const isProductionEnvironment = () => {
  const processLike = globalThis as typeof globalThis & {
    process?: {
      env?: {
        NODE_ENV?: string;
      };
    };
  };

  return processLike.process?.env?.NODE_ENV === 'production';
};

export const createConsoleOverlayDiagnostics = (
  scope: string
): OverlayDiagnostics => ({
  duplicateRegistration(id) {
    if (isProductionEnvironment()) return;

    console.warn(`${scope}: duplicate overlay registration for "${id}".`);
  },

  unknownUnregister(id) {
    if (isProductionEnvironment()) return;

    console.warn(`${scope}: attempted to unregister unknown overlay "${id}".`);
  },
});
