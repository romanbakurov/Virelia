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
  const [layer, setLayer] = useState(() => nativeOverlayManager.getLayer(id));

  useEffect(() => {
    if (!active) return;

    const entry = nativeOverlayManager.register(id);

    setLayer(entry.layer);

    return () => {
      nativeOverlayManager.unregister(id);
    };
  }, [active, id]);

  const isTopOverlay = useCallback(() => nativeOverlayManager.isTop(id), [id]);

  return {
    layer,
    zIndex: layer,
    isTopOverlay,
  };
};
