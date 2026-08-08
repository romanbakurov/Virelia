import { useCallback, useEffect, useState } from 'react';

import { nativeOverlayManager } from '../../../managers/OverlayManager';

export type OverlayRegistrationOptions = {
  active: boolean;
  id: string;
};

export const useOverlayRegistration = ({
  active,
  id,
}: OverlayRegistrationOptions) => {
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
  }, [active, id]);

  const isTopOverlay = useCallback(() => nativeOverlayManager.isTop(id), [id]);

  return {
    zIndex,
    isTopOverlay,
  };
};
