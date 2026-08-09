export type ResolveOverlayPresentationOptions<
  TPresentation extends string,
  TAuto extends TPresentation = TPresentation,
> = {
  presentation?: TPresentation | 'auto';
  defaultPresentation: TPresentation;
  autoPresentation?: TAuto;
};

export function resolveOverlayPresentation<
  TPresentation extends string,
  TAuto extends TPresentation = TPresentation,
>({
  autoPresentation,
  defaultPresentation,
  presentation,
}: ResolveOverlayPresentationOptions<TPresentation, TAuto>): TPresentation {
  if (presentation === 'auto') {
    return autoPresentation ?? defaultPresentation;
  }

  return presentation ?? defaultPresentation;
}
