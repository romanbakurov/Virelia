import { useCallback, useEffect, useState } from 'react';

import { nativeOverlayManager } from './NativeOverlayManager';

type UseNativeOverlayRegistrationParams = {
  id: string;
  visible: boolean;
};

export const useNativeOverlayRegistration = ({
  id,
  visible,
}: UseNativeOverlayRegistrationParams) => {
  const [layer, setLayer] = useState(() => nativeOverlayManager.getLayer(id));

  useEffect(() => {
    if (!visible) return;

    const entry = nativeOverlayManager.register(id);

    setLayer(entry.layer);

    return () => {
      nativeOverlayManager.unregister(id);
    };
  }, [id, visible]);

  const isTopOverlay = useCallback(() => nativeOverlayManager.isTop(id), [id]);

  return {
    layer,
    isTopOverlay,
  };
};
