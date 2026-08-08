export const OVERLAY_STACK_ORDER_STEP = 10;

export type OverlayLayerPolicy<TLayer extends string = string> = {
  defaultLayer: TLayer;
  layers: Record<TLayer, number>;
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

export const createOverlayLayerPolicy = <TLayer extends string>({
  defaultLayer,
  layers,
  orderStep = OVERLAY_STACK_ORDER_STEP,
}: {
  defaultLayer: TLayer;
  layers: Record<TLayer, number>;
  orderStep?: number;
}): OverlayLayerPolicy<TLayer> => ({
  defaultLayer,
  layers,
  orderStep,
});

export const resolveOverlayZIndex = <TLayer extends string>({
  explicitZIndex,
  layer,
  order,
  policy,
}: {
  explicitZIndex?: number;
  layer: TLayer;
  order: number;
  policy: OverlayLayerPolicy<TLayer>;
}) => explicitZIndex ?? policy.layers[layer] + order * policy.orderStep;

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
