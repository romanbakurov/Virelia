import { useCallback, useEffect, useSyncExternalStore } from 'react';

import { type OverlayZIndexLevel, useOverlayManager } from '#managers';

export type OverlayRegistrationOptions = {
  active: boolean;
  id: string;
  zIndexLevel?: OverlayZIndexLevel;
  zIndex?: number;
};

export const useOverlayRegistration = ({
  active,
  id,
  zIndexLevel,
  zIndex: explicitZIndex,
}: OverlayRegistrationOptions) => {
  const overlayManager = useOverlayManager();
  const snapshot = useSyncExternalStore(
    overlayManager.subscribe,
    overlayManager.getSnapshot,
    overlayManager.getSnapshot
  );

  useEffect(() => {
    if (!active) return;

    overlayManager.register({ id, zIndexLevel, zIndex: explicitZIndex });

    return () => {
      overlayManager.unregister(id);
    };
  }, [active, id, overlayManager, zIndexLevel, explicitZIndex]);

  const isTopOverlay = useCallback(
    () => overlayManager.isTopmost(id),
    [id, overlayManager]
  );
  const entry = snapshot.registry.get(id);

  return {
    isTopOverlay,
    isTopmost: snapshot.topmost?.id === id,
    order: entry?.order,
    zIndex: overlayManager.getZIndex(id),
  };
};
