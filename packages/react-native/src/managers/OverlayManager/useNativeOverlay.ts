import { useCallback, useEffect } from 'react';

import { nativeOverlayManager } from './NativeOverlayManager';

type UseNativeOverlayParams = {
  id: string;
  visible: boolean;
};

export const useNativeOverlay = ({ id, visible }: UseNativeOverlayParams) => {
  useEffect(() => {
    if (!visible) return;

    nativeOverlayManager.add(id);

    return () => {
      nativeOverlayManager.remove(id);
    };
  }, [id, visible]);

  const isTopOverlay = useCallback(() => nativeOverlayManager.isTop(id), [id]);

  return { isTopOverlay };
};
