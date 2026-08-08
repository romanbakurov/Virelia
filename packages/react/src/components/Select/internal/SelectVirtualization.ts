interface ResolveSelectVirtualizationParams<TOption> {
  loading?: boolean;
  options: TOption[];
  scrollTop: number;
  virtual?: boolean | SelectVirtualizationConfig;
  viewportHeight?: number;
}

export interface SelectVirtualizationConfig {
  itemHeight?: number;
  maxHeight?: number | string;
  overscan?: number;
  viewportHeight?: number;
}

export function resolveSelectVirtualization<TOption>({
  loading,
  options,
  scrollTop,
  virtual,
  viewportHeight: measuredViewportHeight,
}: ResolveSelectVirtualizationParams<TOption>) {
  const virtualConfig =
    typeof virtual === 'object' ? virtual : virtual ? {} : undefined;
  const itemHeight = virtualConfig?.itemHeight ?? 40;
  const overscan = virtualConfig?.overscan ?? 2;
  const viewportHeight =
    measuredViewportHeight ?? virtualConfig?.viewportHeight ?? 300;
  const isVirtual = Boolean(virtualConfig && options.length > 0 && !loading);
  const startIndex = isVirtual
    ? Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    : 0;
  const visibleCount = isVirtual
    ? Math.ceil(viewportHeight / itemHeight) + overscan * 2
    : options.length;
  const visibleOptions = isVirtual
    ? options.slice(startIndex, startIndex + visibleCount)
    : options;
  const topSpacerHeight = isVirtual ? startIndex * itemHeight : 0;
  const bottomSpacerHeight = isVirtual
    ? Math.max(
        0,
        (options.length - startIndex - visibleOptions.length) * itemHeight
      )
    : 0;

  return {
    bottomSpacerHeight,
    isVirtual,
    itemHeight,
    maxHeight: virtualConfig?.maxHeight,
    overscan,
    startIndex,
    topSpacerHeight,
    viewportHeight,
    visibleOptions,
  };
}
