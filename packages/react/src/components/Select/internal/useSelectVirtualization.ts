import { useMemo } from 'react';

import type { SelectOption } from '../types';

interface UseSelectVirtualizationParams {
  loading?: boolean;
  options: SelectOption[];
  scrollTop: number;
  virtual?: boolean | { itemHeight?: number };
}

export function useSelectVirtualization({
  loading,
  options,
  scrollTop,
  virtual,
}: UseSelectVirtualizationParams) {
  return useMemo(() => {
    const virtualConfig =
      typeof virtual === 'object' ? virtual : virtual ? {} : undefined;
    const itemHeight = virtualConfig?.itemHeight ?? 40;
    const viewportHeight = 300;
    const isVirtual = Boolean(virtualConfig && options.length > 0 && !loading);
    const startIndex = isVirtual
      ? Math.max(0, Math.floor(scrollTop / itemHeight) - 2)
      : 0;
    const visibleCount = isVirtual
      ? Math.ceil(viewportHeight / itemHeight) + 4
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
      startIndex,
      topSpacerHeight,
      viewportHeight,
      visibleOptions,
    };
  }, [loading, options, scrollTop, virtual]);
}
