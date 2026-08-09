import { useCallback, useEffect, useSyncExternalStore } from 'react';

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
  const snapshot = useSyncExternalStore(
    nativeOverlayManager.subscribe,
    nativeOverlayManager.getSnapshot,
    nativeOverlayManager.getSnapshot
  );

  useEffect(() => {
    if (!active) return;

    nativeOverlayManager.register(id);

    return () => {
      nativeOverlayManager.unregister(id);
    };
  }, [active, id, nativeOverlayManager]);

  const isTopOverlay = useCallback(
    () => nativeOverlayManager.isTop(id),
    [id, nativeOverlayManager]
  );
  const entry = snapshot.registry.get(id);

  return {
    zIndex: entry?.zIndex ?? nativeOverlayManager.getZIndex(id),
    isTopmost: snapshot.topmost?.id === id,
    isTopOverlay,
  };
};
