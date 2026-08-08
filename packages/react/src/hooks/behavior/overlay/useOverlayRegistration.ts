import { useCallback, useEffect, useSyncExternalStore } from 'react';

import { type OverlayLayer, overlayManager } from '@/managers';

export type OverlayRegistrationOptions = {
  active: boolean;
  id: string;
  layer?: OverlayLayer;
  zIndex?: number;
};

const getOverlaySnapshot = () => overlayManager.getSnapshot();

export const useOverlayRegistration = ({
  active,
  id,
  layer,
  zIndex: explicitZIndex,
}: OverlayRegistrationOptions) => {
  const snapshot = useSyncExternalStore(
    overlayManager.subscribe,
    getOverlaySnapshot,
    getOverlaySnapshot
  );

  useEffect(() => {
    if (!active) return;

    overlayManager.register({ id, layer, zIndex: explicitZIndex });

    return () => {
      overlayManager.unregister(id);
    };
  }, [active, id, layer, explicitZIndex]);

  const isTopOverlay = useCallback(() => overlayManager.isTopmost(id), [id]);
  const entry = snapshot.registry.get(id);

  return {
    isTopOverlay,
    isTopmost: snapshot.topmost?.id === id,
    order: entry?.order,
    zIndex: overlayManager.getZIndex(id),
  };
};
