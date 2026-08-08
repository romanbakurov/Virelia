type WrappedCompoundSlot<TSlot extends string> = {
  render?: WrappedCompoundSlot<TSlot>;
  type?: WrappedCompoundSlot<TSlot>;
} & Partial<Record<string, TSlot>>;

export function resolveCompoundSlotPart<TSlot extends string>(
  type: unknown,
  marker: string
): TSlot | undefined {
  const slotType = type as WrappedCompoundSlot<TSlot> | undefined;

  return (
    slotType?.[marker] ?? slotType?.type?.[marker] ?? slotType?.render?.[marker]
  );
}
