import { useCallback, useEffect } from 'react';

import { nativeOverlayStackStore } from './NativeOverlayStack';

type UseNativeOverlayStackParams = {
  id: string;
  visible: boolean;
};

export const useNativeOverlayStack = ({
  id,
  visible,
}: UseNativeOverlayStackParams) => {
  useEffect(() => {
    if (!visible) return;

    nativeOverlayStackStore.add(id);

    return () => {
      nativeOverlayStackStore.remove(id);
    };
  }, [id, visible]);

  const isTopOverlay = useCallback(
    () => nativeOverlayStackStore.isTop(id),
    [id]
  );

  return { isTopOverlay };
};
