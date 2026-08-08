import { useCallback, useEffect, useState } from 'react';

import { useNativeOverlayManager } from '../../../managers/OverlayManager';

export type OverlayRegistrationOptions = {
  active: boolean;
  id: string;
};

export const useOverlayRegistration = ({
  active,
  id,
}: OverlayRegistrationOptions) => {
  const nativeOverlayManager = useNativeOverlayManager();
  const [zIndex, setZIndex] = useState(() =>
    nativeOverlayManager.getZIndex(id)
  );

  useEffect(() => {
    if (!active) return;

    const entry = nativeOverlayManager.register(id);

    setZIndex(entry.zIndex);

    return () => {
      nativeOverlayManager.unregister(id);
    };
  }, [active, id, nativeOverlayManager]);

  const isTopOverlay = useCallback(
    () => nativeOverlayManager.isTop(id),
    [id, nativeOverlayManager]
  );

  return {
    zIndex,
    isTopOverlay,
  };
};
