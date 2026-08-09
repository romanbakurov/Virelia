export const compoundSlotSymbol = Symbol.for('@vellira-ui/compound-slot');

export type CompoundSlotKey = string | symbol;

export type CompoundSlotComponent<
  TComponent,
  TSlot extends CompoundSlotKey = CompoundSlotKey,
> = TComponent & {
  [compoundSlotSymbol]?: TSlot;
};

export const markCompoundSlot = <TComponent, TSlot extends CompoundSlotKey>(
  component: TComponent,
  slot: TSlot
): CompoundSlotComponent<TComponent, TSlot> => {
  const marked = component as CompoundSlotComponent<TComponent, TSlot>;

  marked[compoundSlotSymbol] = slot;

  return marked;
};

type WrappedCompoundSlot<TSlot extends CompoundSlotKey> = {
  render?: WrappedCompoundSlot<TSlot>;
  type?: WrappedCompoundSlot<TSlot>;
} & {
  [compoundSlotSymbol]?: TSlot;
};

export const getCompoundSlot = <
  TSlot extends CompoundSlotKey = CompoundSlotKey,
>(
  component: unknown
): TSlot | undefined => {
  const slotComponent = component as WrappedCompoundSlot<TSlot> | undefined;

  return (
    slotComponent?.[compoundSlotSymbol] ??
    slotComponent?.type?.[compoundSlotSymbol] ??
    slotComponent?.render?.[compoundSlotSymbol]
  );
};

export const copyCompoundSlotMetadata = <
  TSource,
  TTarget,
  TSlot extends CompoundSlotKey = CompoundSlotKey,
>(
  source: TSource,
  target: TTarget
): TTarget => {
  const slot = getCompoundSlot<TSlot>(source);

  if (slot !== undefined) {
    (target as CompoundSlotComponent<TTarget, TSlot>)[compoundSlotSymbol] =
      slot;
  }

  return target;
};
