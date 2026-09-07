export type SemanticFocusRing = {
  readonly color: string;
  readonly width: string;
  readonly shadow: string;
  readonly offsetColor: string;
};

export const createComponentFocusRing = (ring: SemanticFocusRing) =>
  ({
    color: ring.color,
    width: ring.width,
    shadow: ring.shadow,
    offset: ring.offsetColor,
  }) as const;
